export interface LoginPayloadI {
  usuario: string;
  contrasenia: string;
}

export interface RegisterPayloadI extends LoginPayloadI {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}
