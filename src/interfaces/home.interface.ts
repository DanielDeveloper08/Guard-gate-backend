import { VisitI } from './visit.interface';

export interface VisitDataI {
  lastVisits: Array<VisitI>;
  pendingVisits: Array<VisitI>;
  frequentVisits: Array<VisitI>;
}
