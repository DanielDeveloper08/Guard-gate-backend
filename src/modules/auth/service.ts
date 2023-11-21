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
  RegisterPayloadI,
  UserTokenPayloadI,
  ValidateLoginI,
} from '../../interfaces/auth.interface';
import {
  INVALID_OTP,
  LOGIN_FAIL,
  OTP_EXPIRED,
  OTP_USED,
  RECORD_CREATED_FAIL,
  SEND_EMAIL_FAIL,
  SEND_OTP_MESSAGE,
  UNREGISTERED_USER,
  USER_REGISTERED,
} from '../../shared/messages';
import { PersonRespository } from '../person/repository';
import { TokenOtpRepository } from '../token-otp/repository';
import { Environments } from '../../config/environments';

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

    const user = await this._repo.getByUser(cnx, usuario);

    if (!user) throw UNREGISTERED_USER;

    const person = await this._repoPerson.getById(cnx, user.personId);

    if (!person) throw UNREGISTERED_USER;

    const isMatch = this.comparePassword(contrasenia, user.password);

    if (!isMatch) throw LOGIN_FAIL;

    const otpPayload = {
      code: this.generateOtp(),
      userId: user.id,
      createdAt: new Date(),
    } as TokenOtpEntity;

    await this._repoOtp.create(cnx, otpPayload);

    const [, emailSuccess] = await this._email.sendLoginMail({
      to: person.email,
      fullname: `${person.names} ${person.surnames}`,
      code: otpPayload.code,
    });

    if (!emailSuccess) throw SEND_EMAIL_FAIL;

    return SEND_OTP_MESSAGE;
  }

  async validateLogin(cnx: EntityManager, payload: ValidateLoginI) {
    const { usuario, codigo } = payload;

    const user = await this._repo.getByUser(cnx, usuario);

    if (!user) throw UNREGISTERED_USER;

    const person = await this._repoPerson.getById(cnx, user.personId);

    if (!person) throw UNREGISTERED_USER;

    const codeOtp = await this._repoOtp.getValidCode(cnx, user.id, codigo);

    if (!codeOtp) throw INVALID_OTP;
    if (codeOtp.used) throw OTP_USED;

    const invalidOtp = this.validateDurationOTP(codeOtp.createdAt);

    if (invalidOtp) {
      await this._repoOtp.setUsed(cnx, codeOtp.id);
      throw OTP_EXPIRED;
    }

    await this._repoOtp.setUsed(cnx, codeOtp.id);

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
      return RECORD_CREATED_FAIL(`persona: ${nombres} ${apellidos}`);

    const passwordHashed = this._encryptor.encrypt(contrasenia);

    const userPayload = {
      user: payload.usuario,
      password: passwordHashed,
      personId: personCreated.id,
    } as UserEntity;

    const userCreated = await this._repo.create(cnx, userPayload);

    if (!userCreated) return RECORD_CREATED_FAIL(`usuario: ${usuario}`);

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

  private comparePassword(plainPass: string, encryptPass: string): boolean {
    return this._encryptor.encrypt(plainPass) === encryptPass;
  }

  private generateOtp(): string {
    return this._random.generateCharacters('num', 6);
  }

  private validateDurationOTP(creationDate: Date): boolean {
    const durationOtp = this.getNumberEnv('DURATION_OTP') ?? 3;
    const diff = this._dateFormat.getDiffInMinutes(creationDate);

    return diff > durationOtp;
  }
}
