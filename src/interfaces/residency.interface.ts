export interface ResidencyI {
  id: number;
  block: string;
  town: string;
  urbanization: string;
  residentName: string;
  residentEmail: string;
  residentPhone: string;
  personId: number;
}

export type ResidencyDTO = Omit<ResidencyI, 'id' >;
