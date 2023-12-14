export interface VisitorI {
  id: number;
  names: string;
  surnames: string;
  docNumber: string;
  idResidency: number;
}

export type VisitorDTO = Omit<VisitorI, 'id' | 'idResidency'>;
