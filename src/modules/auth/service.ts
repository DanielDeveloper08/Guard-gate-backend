import { EntityManager } from 'typeorm';
import { PersonEntity, RoleEntity, TokenOtpEntity, UserEntity } from '../../database';
import { UserRepository } from '../user/repository';
import {
  JwtHelper,
  EncryptorHelper,
  RandomHelper,
  DateFormatHelper,
  EmailHelper,
} from '../../helpers';
import {
  LoginPayloadI,
  RecoverPasswordI,
  RegisterPayloadI,
  ResetPasswordI,
  UserTokenPayloadI,
  ValidateLoginI,
} from '../../interfaces/auth.interface';
import {
  INVALID_OTP,
  LOGIN_FAIL,
  OTP_EXPIRED,
  OTP_USED,
  RECORD_CREATED_FAIL,
  RECORD_EDIT_FAIL,
  RECOVER_PASSWORD,
  RESET_PASSWORD,
  SEND_EMAIL_FAIL,
  SEND_OTP_MESSAGE,
  UNREGISTERED_USER,
  USER_REGISTERED,
} from '../../shared/messages';
import { PersonRespository } from '../person/repository';
import { RoleRepository } from '../role/repository';
import { TokenOtpRepository } from '../token-otp/repository';
import { Environments } from '../../config/environments';
import { AuthTypeEnum } from '../../enums/auth.enum';
import { UserI } from '../../interfaces/user.interface';
import { RoleTypeEnum } from '../../enums/role.enum';
import { ServiceException } from '../../shared/service-exception';

export class AuthService extends Environments {

  constructor(
    private readonly _repo = new UserRepository(),
    private readonly _repoPerson = new PersonRespository(),
    private readonly _repoRole = new RoleRepository(),
    private readonly _repoOtp = new TokenOtpRepository(),
    private readonly _jwt = new JwtHelper(),
    private readonly _encryptor = new EncryptorHelper(),
    private readonly _random = new RandomHelper(),
    private readonly _dateFormat = new DateFormatHelper(),
    private readonly _email = new EmailHelper()
  ) {
    super();
  }

  async login(cnx: EntityManager, payload: LoginPayloadI) {
    const { usuario, contrasenia } = payload;

    const user = await this.getValidUser(cnx, usuario);

    const isMatch = this.comparePassword(contrasenia, user.password);
    if (!isMatch) throw new ServiceException(LOGIN_FAIL);

    const otpCreated = await this.createOtpCode(cnx, user.id);

    const [, emailSuccess] = await this._email.sendTwoStepAuth({
      to: user.email,
      fullname: `${user.names} ${user.surnames}`,
      code: otpCreated.code,
      type: AuthTypeEnum.LOGIN,
    });

    if (!emailSuccess) throw new ServiceException(SEND_EMAIL_FAIL);

    return SEND_OTP_MESSAGE;
  }

  async validateLogin(cnx: EntityManager, payload: ValidateLoginI) {
    const user = await this.validateOtp(cnx, payload);

    const tokenPayload: UserTokenPayloadI = {
      id: user.id,
      nombres: user.names,
      apellidos: user.surnames,
      correo: user.email,
      telefono: user.phone,
      rol: user.role,
    };

    const token = this._jwt.create(tokenPayload);

    return {
      token,
      user: tokenPayload,
    };
  }

  async register(cnx: EntityManager, payload: RegisterPayloadI) {
    const {
      usuario,
      contrasenia,
      nombres,
      apellidos,
      correo,
      telefono,
    } = payload;

    const existsUser = await this._repo.getByUser(cnx, usuario);
    const existsEmail = await this._repoPerson.getByEmail(cnx, correo);

    if (existsUser || existsEmail) {
      throw new ServiceException(USER_REGISTERED);
    }

    const personPayload = {
      names: nombres,
      surnames: apellidos,
      email: correo,
      phone: telefono ?? null,
    } as PersonEntity;

    const personCreated = await this._repoPerson.create(cnx, personPayload);

    if (!personCreated) {
      throw new ServiceException(RECORD_CREATED_FAIL(`persona: ${nombres} ${apellidos}`));
    }

    const exitsRole = await this._repoRole.getByRoleName(
      cnx,
      RoleTypeEnum.RESIDENT
    );

    const rolePayload = {
      name: RoleTypeEnum.RESIDENT,
    } as RoleEntity;

    const role = exitsRole ?? (await this._repoRole.create(cnx, rolePayload));

    const passwordHashed = this._encryptor.encrypt(contrasenia);

    const userPayload = {
      user: payload.usuario,
      password: passwordHashed,
      personId: personCreated.id,
      roleId: role.id,
    } as UserEntity;

    const userCreated = await this._repo.create(cnx, userPayload);

    if (!userCreated) {
      throw new ServiceException(RECORD_CREATED_FAIL(`usuario: ${usuario}`));
    }

    const user: UserTokenPayloadI = {
      id: userCreated.id,
      nombres: personCreated.names,
      apellidos: personCreated.surnames,
      correo,
      telefono: personCreated.phone,
      rol: role.name,
    };

    return user;
  }

  async recoverPassword(cnx: EntityManager, payload: RecoverPasswordI) {
    const { usuario } = payload;

    const user = await this.getValidUser(cnx, usuario);

    const otpCreated = await this.createOtpCode(cnx, user.id);

    const [, emailSuccess] = await this._email.sendTwoStepAuth({
      to: user.email,
      fullname: `${user.names} ${user.surnames}`,
      code: otpCreated.code,
      type: AuthTypeEnum.RECOVER_PASSWORD,
    });

    if (!emailSuccess) throw new ServiceException(SEND_EMAIL_FAIL);

    return RECOVER_PASSWORD;
  }

  async resetPassword(cnx: EntityManager, payload: ResetPasswordI) {
    const { usuario, nueva_contrasenia } = payload;

    const user = await this.getValidUser(cnx, usuario);

    const passwordHashed = this._encryptor.encrypt(nueva_contrasenia);

    const userPayload = {
      password: passwordHashed,
    } as UserEntity;

    const userUpdated = await this._repo.update(cnx, user.id, userPayload);

    if (!userUpdated) {
      throw new ServiceException(RECORD_EDIT_FAIL('la contraseña'));
    }

    return RESET_PASSWORD;
  }

  async validateOtp(cnx: EntityManager, payload: ValidateLoginI) {
    const { usuario, codigo } = payload;

    const user = await this.getValidUser(cnx, usuario);

    const codeOtp = await this._repoOtp.getValidCode(cnx, user.id, codigo);
    if (!codeOtp) throw new ServiceException(INVALID_OTP);
    if (codeOtp.used) throw new ServiceException(OTP_USED);

    const invalidOtp = this.validateDurationOTP(codeOtp.createdAt);

    if (invalidOtp) {
      await this._repoOtp.setUsed(cnx, codeOtp.id);
      throw new ServiceException(OTP_EXPIRED);
    }

    await this._repoOtp.setUsed(cnx, codeOtp.id);

    return user;
  }

  private async getValidUser(cnx: EntityManager, user: string): Promise<UserI> {
    const existsUser = await this._repo.getByUser(cnx, user);
    if (!existsUser) throw new ServiceException(UNREGISTERED_USER);

    return existsUser;
  }

  private async createOtpCode(cnx: EntityManager, userId: number) {
    const code = this._random.generateCharacters('num', 6);

    const otpPayload = {
      code,
      userId,
      createdAt: new Date(),
    } as TokenOtpEntity;

    const otpCreated = await this._repoOtp.create(cnx, otpPayload);

    return otpCreated;
  }

  private comparePassword(plainPass: string, encryptPass: string): boolean {
    return this._encryptor.encrypt(plainPass) === encryptPass;
  }

  private validateDurationOTP(creationDate: Date): boolean {
    const durationOtp = this.getNumberEnv('DURATION_OTP') ?? 3;
    const diff = this._dateFormat.getDiffInMinutes(creationDate);

    return diff > durationOtp;
  }
}
