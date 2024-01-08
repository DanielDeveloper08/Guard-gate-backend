export enum VisitTypeEnum {
  QR = 'QR',
  PREAUTHORIZED = 'PREAUTORIZADO',
}

export enum VisitStatusEnum {
  PENDING = 'PENDIENTE',      // Initial State
  FULFILLED = 'COMPLETADA',   // Sensor
  CANCELLED = 'CANCELADA',    // Resident
  APPROVED = 'APROBADA',      // Guard
  REJECTED = 'RECHAZADA',     // Guard
  EXPIRED = 'CADUCADA',       // Sensor or Service
}
