export const OK_200 = 'Proceso realizado con éxito.';
export const ERR_401 = 'No tiene autorización para ejecutar este proceso.';
export const ERR_400 = 'Ocurrio un error, comuníquese con el administrador.';
export const LOGIN_FAIL = 'Usuario y/o contraseña incorrecta';

export const TOKEN_INVALID = 'Su sesión ha expirado. Inicie sesión nuevamente';

export const USER_REGISTERED = 'Usuario ya tiene una cuenta previa registrada';
export const UNREGISTERED_USER = 'Usuario no tiene una cuenta previa registrada';

export const REGISTER_SUCCESS =
  'Registro exitoso, se ha enviado un correo de confirmación con instrucciones a su dirección de correo electrónico.';

export const RECOVER_PASSWORD =
  'Se ha enviado un correo de recuperación con instrucciones a su dirección de correo electrónico.';

export const SEND_OTP_MESSAGE =
  'Se ha enviado un código de seguridad al correo registrado';

export const EXISTS_RECORD = (detail: string) => `Ya existe ${detail}`;

export const NO_EXIST_RECORD = (detail: string) => `No existe ${detail}`;

export const RECORD_CREATED = (detail: string) => `${detail} creado con éxito.`;

export const RECORD_EDIT = (detail: string) =>
  `${detail} actualizado con éxito.`;

export const RECORD_CREATED_FAIL = (detail: string) =>
  `No se puede crear ${detail}.`;

export const RECORD_EDIT_FAIL = (detail: string) =>
  `No se puede actualizar ${detail}.`;

export const RECORD_DELETE_FAIL = (detail: string) =>
  `No se puede eliminar ${detail}.`;
