export interface LoginPayloadI {
  usuario: string;
  contrasenia: string;
}

export interface RegisterPayloadI extends LoginPayloadI {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
}

export interface ValidateLoginI {
  usuario: string;
  codigo: string;
}

export interface UserTokenPayloadI {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  rol: string | null;
}

export type RecoverPasswordI = Pick<LoginPayloadI, 'usuario'>;

export type ResetPasswordI = Pick<LoginPayloadI, 'usuario'> & {
  nueva_contrasenia: string;
};

export type UserTokenDecodeI = Record<'data', UserTokenPayloadI> & {
  iat: number;
  exp: number;
};
