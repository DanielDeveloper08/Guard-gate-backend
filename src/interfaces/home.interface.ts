import { VisitI } from './visit.interface';
import { VisitorI } from './visitor.interface';

export interface VisitDataPayloadI {
  limit?: string;
  frequency?: string;
}

export interface VisitDataI {
  lastVisits: Array<VisitI>;
  pendingVisits: Array<VisitI>;
  frequentVisitors: Array<VisitorI>;
}
