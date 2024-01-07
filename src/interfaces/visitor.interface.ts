export interface VisitorI {
  id: number;
  names: string;
  surnames: string;
  docNumber: string;
  phone: string;
  status: boolean;
  idResidency: number;
}

export type VisitorDTO = Omit<VisitorI, 'id' | 'idResidency' | 'status'>;
export type VisitorUpdateDTO = Omit<VisitorDTO, 'docNumber'>
