import { VisitTypeEnum } from '../enums/visit.enum';

export interface VisitDTO {
  startDate: Date;
  validityHours: number;
  listVisitors: Array<number>;
  type: VisitTypeEnum;
}
