import { VisitTypeEnum } from '../enums/visit.enum';
import { VisitorI } from './visitor.interface';

export interface VisitI {
  id: number;
  startDate: Date;
  endDate?: Date;
  validityHours: number;
  reason?: string;
  idResidency?: number;
  status?: string;
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
  photos: Array<string>;
}
