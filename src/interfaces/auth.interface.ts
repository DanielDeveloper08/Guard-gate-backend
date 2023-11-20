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
  telefono?: string;
  rol?: string;
}
