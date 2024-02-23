export interface PersonI {
  id: number;
  names: string;
  surnames: string;
  email: string;
  phone: string;
  residences: Array<ResidencyByPersonI>;
}

export interface ResidencyByPersonI {
  id: number;
  block: string;
  town: string;
  isMain: boolean;
}
