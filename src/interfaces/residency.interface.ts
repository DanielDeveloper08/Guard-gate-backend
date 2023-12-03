export interface ResidencyI {
  id: number;
  block: string;
  town: string;
  urbanization: string;
  personId: number;
}

export type ResidencyDTO = Omit<ResidencyI, 'id' >;
