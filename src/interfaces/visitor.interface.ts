export interface VisitorI {
  id: number;
  names: string;
  surnames: string;
  docNumber: string;
  phone: string;
  status: boolean;
  idResidency: number;
  hasEntered: boolean;
  entryDate: Date;
  carPlate: string;
  observation: string;
  photos: Array<string>;
}

export type VisitorDTO = Omit<VisitorI, 'id' | 'idResidency' | 'status'>;
export type VisitorUpdateDTO = Omit<VisitorDTO, 'docNumber'>;
