export interface ResidencyI {
  id: number;
  block: string;
  town: string;
  urbanization: string;
  residentName: string;
  residentEmail: string;
  residentPhone: string;
  personId: number;
  isMain: boolean;
}

export type ResidencyDTO = Omit<ResidencyI, 'id'>;

export interface ResidencyMassiveRequest {
  personId: number;
  residences: ResidencyI[];
}

export type ResidencyMassiveDTO = Omit<
  ResidencyI,
  'residentName' | 'residentEmail' | 'residentPhone' | 'createdAt'
>;
