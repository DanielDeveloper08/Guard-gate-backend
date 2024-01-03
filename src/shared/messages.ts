export const OK_200 = 'Proceso realizado con éxito';
export const ERR_401 = 'No tiene autorización para ejecutar este proceso';
export const ERR_400 = 'Ocurrio un error, comuníquese con el administrador';
export const LOGIN_FAIL = 'Usuario y/o contraseña incorrecta';

export const TOKEN_INVALID = 'Su sesión ha expirado. Inicie sesión nuevamente';

export const USER_REGISTERED = 'Usuario ya tiene una cuenta previa registrada';
export const UNREGISTERED_USER =
  'Usuario no tiene una cuenta previa registrada';

export const REGISTER_SUCCESS =
  'Registro exitoso, se ha enviado un correo de confirmación con instrucciones a su dirección de correo electrónico';

export const RECOVER_PASSWORD =
  'Se ha enviado un correo para la recuperación de su contraseña';

export const RESET_PASSWORD = 'Se ha restablecido su contraseña exitosamente';

export const SEND_OTP_MESSAGE =
  'Se ha enviado un código de acceso al correo registrado';

export const SEND_EMAIL_FAIL = 'Ocurrio un error al enviar el correo';

export const INVALID_OTP = 'Código de acceso incorrecto';
export const OTP_USED = 'Código de acceso ya fue utilizado';
export const OTP_EXPIRED = 'Código de acceso ya expiró';

export const EXISTS_RECORD = (detail: string) => `Ya existe ${detail}`;

export const NO_EXIST_RECORD = (detail: string) => `No existe ${detail}`;

export const RECORD_CREATED = (detail: string) => `${detail} creado con éxito`;

export const RECORD_EDIT = (detail: string) =>
  `${detail} actualizado con éxito`;

export const RECORD_DELETE = (detail: string) =>
  `${detail} eliminado con éxito`;

export const RECORD_CREATED_FAIL = (detail: string) =>
  `No se pudo crear ${detail}`;

export const RECORD_EDIT_FAIL = (detail: string) =>
  `No se pudo actualizar ${detail}`;

export const RECORD_DELETE_FAIL = (detail: string) =>
  `No se pudo eliminar ${detail}`;

export const VALID_LIST_VISITORS = 'Debe seleccionar mínimo un visitante';

export const REASON_VISIT = (residencyName: string) =>
  `Visita a ${residencyName.toUpperCase()}`;

export const VISITOR_HAS_ENTERED = 'Visitante ya registra un ingreso previo';

export const VISIT_OUT_RANGE = 'Visita fuera del tiempo establecido';

export const VISITOR_DISABLE = 'Visitante ya se encuentra desactivado';
