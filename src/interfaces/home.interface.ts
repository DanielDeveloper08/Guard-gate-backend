import { VisitI } from './visit.interface';

export interface VisitDataPayloadI {
  limit?: string;
  frequency?: string;
}

export interface VisitDataI {
  lastVisits: Array<VisitI>;
  pendingVisits: Array<VisitI>;
  frequentVisits: Array<VisitI>;
}
