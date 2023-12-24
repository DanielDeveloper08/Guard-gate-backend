import { VisitTypeEnum } from '../enums/visit.enum';
import { VisitorI } from './visitor.interface';

export interface VisitI {
  id: number;
  startDate: Date;
  endDate?: Date;
  validityHours: number;
  reason?: string;
  status?: string;
  type: VisitTypeEnum;
  visitors: Array<VisitorI>;
}

export interface VisitDTO
  extends Omit<VisitI, 'id' | 'endDate' | 'reason' | 'status' | 'visitors'> {
  listVisitors: Array<number>;
}
