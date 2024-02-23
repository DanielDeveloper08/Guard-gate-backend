import { VisitorI } from './visitor.interface';
import { VisitStatusEnum, VisitTypeEnum } from '../enums/visit.enum';
import { PaginationI } from './global.interface';

export interface VisitI {
  id: number;
  startDate: Date;
  endDate?: Date;
  validityHours: number;
  reason?: string;
  generatedBy: string;
  idResidency?: number;
  block: string;
  town: string;
  status?: VisitStatusEnum;
  type: VisitTypeEnum;
  visitors: Array<VisitorI>;
}

export interface VisitDTO
  extends Omit<
    VisitI,
    'id' | 'endDate' | 'idResidency' | 'status' | 'visitors'
  > {
  listVisitors: Array<number>;
}

export interface SaveVisitDetailI {
  visitId: number;
  visitorId: number;
  observation?: string;
  carPlate?: string;
  hasEntered: boolean;
  photos: Array<string>;
}

export interface NotificationPayloadI {
  visitId: number;
  imgUrl: string;
}

export interface VisitInRangeI {
  id: number;
  type: VisitTypeEnum;
  startDate: Date;
  validityHours: number;
  status: VisitStatusEnum;
}

export interface VisitPayloadI extends PaginationI {
  residencyId?: string;
}
