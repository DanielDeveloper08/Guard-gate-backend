export interface VisitorI {
  id: number;
  names: string;
  surnames: string;
  docNumber: string;
  phone: string;
  idResidency: number;
  status: boolean;
}

export type VisitorDTO = Omit<VisitorI, 'id' | 'idResidency' | 'status'>;
export type VisitorUpdateDTO = Omit<VisitorDTO, 'docNumber'>
