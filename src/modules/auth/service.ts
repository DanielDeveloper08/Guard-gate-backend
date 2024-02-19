import { EntityManager } from "typeorm";
import {
  PersonEntity,
  RoleEntity,
  TokenOtpEntity,
  UserEntity,
} from "../../database";
import { UserRepository } from "../user/repository";
import {
  JwtHelper,
  EncryptorHelper,
  RandomHelper,
  DateFormatHelper,
  EmailHelper,
} from "../../helpers";
import {
  LoginPayloadI,
  LoginResponseI,
  RecoverPasswordI,
  RegisterPayloadI,
  ResetPasswordI,
  UpdatePayloadI,
  UserTokenPayloadI,
  ValidateLoginI,
} from "../../interfaces/auth.interface";
import {
  INVALID_OTP,
  LOGIN_FAIL,
  OTP_EXPIRED,
  OTP_USED,
  RECORD_CREATED_FAIL,
  RECORD_EDIT_FAIL,
  RECORD_UPDATED_FAIL,
  RECOVER_PASSWORD,
  RESET_PASSWORD,
  SEND_EMAIL_FAIL,
  UNREGISTERED_USER,
  USERNAME_REGISTERED,
  USER_EMAIL_REGISTERED,
  USER_REGISTERED,
} from "../../shared/messages";
import { PersonRespository } from "../person/repository";
import { RoleRepository } from "../role/repository";
import { TokenOtpRepository } from "../token-otp/repository";
import { Environments } from "../../config/environments";
import { AuthTypeEnum } from "../../enums/auth.enum";
import { UserI } from "../../interfaces/user.interface";
import { RoleTypeEnum } from "../../enums/role.enum";
import { ServiceException } from "../../shared/service-exception";

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

  async login(
    cnx: EntityManager,
    payload: LoginPayloadI
  ): Promise<LoginResponseI> {
    const { username, password } = payload;

    const user = await this.getValidUser(cnx, username, true);
    const isMatch = this.comparePassword(password, user.password!);

    if (!isMatch) throw new ServiceException(LOGIN_FAIL);

    const roles = await this._repoRole.getById(cnx, user.roleId);
    const operations = roles?.operations.map((op) => op.name) ?? [];

    const tokenPayload: UserTokenPayloadI = {
      id: user.id,
      names: user.names,
      surnames: user.surnames,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = this._jwt.create(tokenPayload);

    const data: LoginResponseI = {
      token,
      user: {
        ...tokenPayload,
        operations,
      },
    };

    return data;
  }

  async validateLogin(cnx: EntityManager, payload: ValidateLoginI) {
    const user = await this.validateOtp(cnx, payload);

    const tokenPayload: UserTokenPayloadI = {
      id: user.id,
      names: user.names,
      surnames: user.surnames,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = this._jwt.create(tokenPayload);

    return {
      token,
      user: tokenPayload,
    };
  }

  async register(cnx: EntityManager, payload: RegisterPayloadI) {
    const { username, password, names, surnames, email, phone, roleId } =
      payload;

    const existsUser = await this._repo.getByUsername(cnx, username);
    const existsEmail = await this._repoPerson.getByEmail(cnx, email);

    if (existsUser || existsEmail) {
      throw new ServiceException(USER_REGISTERED);
    }

    const personPayload = {
      names,
      surnames,
      email,
      phone: phone ?? null,
    } as PersonEntity;

    const personCreated = await this._repoPerson.create(cnx, personPayload);

    if (!personCreated) {
      throw new ServiceException(
        RECORD_CREATED_FAIL(`persona: ${names} ${surnames}`)
      );
    }

    const exitsRole = await this._repoRole.getByRoleName(
      cnx,
      RoleTypeEnum.RESIDENT
    );

    const rolePayload = {
      name: RoleTypeEnum.RESIDENT,
    } as RoleEntity;

    const role = exitsRole ?? (await this._repoRole.create(cnx, rolePayload));

    const passwordHashed = this._encryptor.encrypt(password);

    const userPayload = {
      user: username,
      password: passwordHashed,
      personId: personCreated.id,
      roleId: roleId,
    } as UserEntity;

    const userCreated = await this._repo.create(cnx, userPayload);

    if (!userCreated) {
      throw new ServiceException(RECORD_CREATED_FAIL(`usuario: ${username}`));
    }

    const user: UserTokenPayloadI = {
      id: userCreated.id,
      names: personCreated.names,
      surnames: personCreated.surnames,
      email,
      phone: personCreated.phone,
      role: role.name,
    };

    return user;
  }

  async updateUser(cnx: EntityManager, payload: UpdatePayloadI) {
    const { id, username, names, surnames, email, phone, roleId, status } =
      payload;

    const userCurrentData = await this._repo.getUserById(cnx, id);
    if (!userCurrentData) {
      throw new ServiceException(UNREGISTERED_USER);
    }

    const existsUser = await this._repo.getByUsername(cnx, username);
    const existsEmail = await this._repoPerson.getByEmail(cnx, email);

    if (existsUser && userCurrentData.user.trim() != username.trim()) {
      throw new ServiceException(USERNAME_REGISTERED);
    }

    if (existsEmail && userCurrentData.person.email.trim() != email.trim()) {
      throw new ServiceException(USER_EMAIL_REGISTERED);
    }

    const personPayload = {
      names,
      surnames,
      email,
      phone: phone ?? null,
    } as PersonEntity;

    const personUpdated = await this._repoPerson.update(
      cnx,
      userCurrentData.personId,
      personPayload
    );

    if (personUpdated == 0) {
      throw new ServiceException(
        RECORD_UPDATED_FAIL(`persona: ${names} ${surnames}`)
      );
    }

    const userPayload = {
      user: username,
      personId: userCurrentData.personId,
      roleId: roleId,
      status: status,
    } as UserEntity;

    const userUpdated = await this._repo.update(cnx, id, userPayload);

    if (!userUpdated) {
      throw new ServiceException(RECORD_UPDATED_FAIL(`usuario: ${username}`));
    }

    const user = await this._repo.getUserById(cnx, id);

    if (!user) {
      throw new ServiceException(RECORD_UPDATED_FAIL(`usuario: ${username}`));
    }

    return {
      id: user.id,
      username: user.user,
      roleId: user.roleId,
      personId: user.person.id,
      names: user.person.names,
      surnames: user.person.surnames,
      email: user.person.email,
      phone: user.person.phone,
      role: user.role.name,
    };
  }

  async recoverPassword(cnx: EntityManager, payload: RecoverPasswordI) {
    const { username } = payload;

    const user = await this.getValidUser(cnx, username);

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
    const { username, newPassword } = payload;

    const user = await this.getValidUser(cnx, username);

    const passwordHashed = this._encryptor.encrypt(newPassword);

    const userPayload = {
      password: passwordHashed,
      updatedAt: new Date(),
    } as UserEntity;

    const userUpdated = await this._repo.update(cnx, user.id, userPayload);

    if (!userUpdated) {
      throw new ServiceException(RECORD_EDIT_FAIL("la contraseña"));
    }

    return RESET_PASSWORD;
  }

  async validateOtp(cnx: EntityManager, payload: ValidateLoginI) {
    const { username, code } = payload;

    const user = await this.getValidUser(cnx, username);

    const codeOtp = await this._repoOtp.getValidCode(cnx, user.id, code);
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

  private async getValidUser(
    cnx: EntityManager,
    username: string,
    withPass: boolean = false
  ): Promise<UserI> {
    const existsUser = await this._repo.getByUsername(cnx, username, withPass);
    if (!existsUser) throw new ServiceException(LOGIN_FAIL);

    return existsUser;
  }

  private async createOtpCode(cnx: EntityManager, userId: number) {
    const code = this._random.generateCharacters("num", 6);

    const otpPayload = {
      code,
      userId,
      createdAt: new Date(),
    } as TokenOtpEntity;

    const otpCreated = await this._repoOtp.create(cnx, otpPayload);

    return otpCreated;
  }

  private comparePassword(plainPass: string, encryptPass: string): boolean {
    return this._encryptor.decrypt(encryptPass) === plainPass;
  }

  private validateDurationOTP(creationDate: Date): boolean {
    const durationOtp = this.getNumberEnv("DURATION_OTP") ?? 3;
    const diff = this._dateFormat.getDiffInMinutes(creationDate);

    return diff > durationOtp;
  }
}
