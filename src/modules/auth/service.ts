import { EntityManager } from 'typeorm';
import { PersonEntity, TokenOtpEntity, UserEntity } from '../../database';
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
import { TokenOtpRepository } from '../token-otp/repository';
import { Environments } from '../../config/environments';
import { AuthTypeEnum } from '../../enums/auth.enum';

export class AuthService extends Environments {

  constructor(
    private readonly _repo = new UserRepository(),
    private readonly _repoPerson = new PersonRespository(),
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

    const { user, person } = await this.getValidUser(cnx, usuario);

    const isMatch = this.comparePassword(contrasenia, user.password);
    if (!isMatch) throw LOGIN_FAIL;

    const otpCreated = await this.createOtpCode(cnx, user.id);

    const [, emailSuccess] = await this._email.sendTwoStepAuth({
      to: person.email,
      fullname: `${person.names} ${person.surnames}`,
      code: otpCreated.code,
      type: AuthTypeEnum.LOGIN,
    });

    if (!emailSuccess) throw SEND_EMAIL_FAIL;

    return SEND_OTP_MESSAGE;
  }

  async validateLogin(cnx: EntityManager, payload: ValidateLoginI) {
    const { user, person } = await this.validateOtp(cnx, payload);

    const tokenPayload: UserTokenPayloadI = {
      id: user.id,
      nombres: person.names,
      apellidos: person.surnames,
      correo: person.email,
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

    if (existsUser || existsEmail) throw USER_REGISTERED;

    const personPayload = {
      names: nombres,
      surnames: apellidos,
      email: correo,
      phone: telefono ?? null,
    } as PersonEntity;

    const personCreated = await this._repoPerson.create(cnx, personPayload);

    if (!personCreated)
      throw RECORD_CREATED_FAIL(`persona: ${nombres} ${apellidos}`);

    const passwordHashed = this._encryptor.encrypt(contrasenia);

    const userPayload = {
      user: payload.usuario,
      password: passwordHashed,
      personId: personCreated.id,
    } as UserEntity;

    const userCreated = await this._repo.create(cnx, userPayload);

    if (!userCreated) throw RECORD_CREATED_FAIL(`usuario: ${usuario}`);

    const tokenPayload: UserTokenPayloadI = {
      id: userCreated.id,
      nombres: personCreated.names,
      apellidos: personCreated.surnames,
      correo,
    };

    const token = this._jwt.create(tokenPayload);

    return {
      token,
      user: tokenPayload,
    };
  }

  async recoverPassword(cnx: EntityManager, payload: RecoverPasswordI) {
    const { usuario } = payload;

    const { user, person } = await this.getValidUser(cnx, usuario);

    const otpCreated = await this.createOtpCode(cnx, user.id);

    const [, emailSuccess] = await this._email.sendTwoStepAuth({
      to: person.email,
      fullname: `${person.names} ${person.surnames}`,
      code: otpCreated.code,
      type: AuthTypeEnum.RECOVER_PASSWORD,
    });

    if (!emailSuccess) throw SEND_EMAIL_FAIL;

    return RECOVER_PASSWORD;
  }

  async resetPassword(cnx: EntityManager, payload: ResetPasswordI) {
    const { usuario, nueva_contrasenia } = payload;

    const { user } = await this.getValidUser(cnx, usuario);

    const passwordHashed = this._encryptor.encrypt(nueva_contrasenia);

    const userPayload = {
      password: passwordHashed,
    } as UserEntity;

    const userUpdated = await this._repo.update(cnx, user.id, userPayload);

    if (!userUpdated) throw RECORD_EDIT_FAIL('la contraseña');

    return RESET_PASSWORD;
  }

  async validateOtp(cnx: EntityManager, payload: ValidateLoginI) {
    const { usuario, codigo } = payload;

    const { user, person } = await this.getValidUser(cnx, usuario);

    const codeOtp = await this._repoOtp.getValidCode(cnx, user.id, codigo);
    if (!codeOtp) throw INVALID_OTP;
    if (codeOtp.used) throw OTP_USED;

    const invalidOtp = this.validateDurationOTP(codeOtp.createdAt);

    if (invalidOtp) {
      await this._repoOtp.setUsed(cnx, codeOtp.id);
      throw OTP_EXPIRED;
    }

    await this._repoOtp.setUsed(cnx, codeOtp.id);

    return {
      user,
      person,
    };
  }

  private async getValidUser(cnx: EntityManager, user: string) {
    const existsUser = await this._repo.getByUser(cnx, user);
    if (!existsUser) throw UNREGISTERED_USER;

    const existsPerson = await this._repoPerson.getById(
      cnx,
      existsUser.personId
    );

    if (!existsPerson) throw UNREGISTERED_USER;

    return {
      user: existsUser,
      person: existsPerson,
    };
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
