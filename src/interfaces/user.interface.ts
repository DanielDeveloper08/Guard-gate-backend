export interface UserI {
  id: number;
  names: string;
  surnames: string;
  email: string;
  phone: string;
  role: string;
  roleId: number;
  password?: string;
}

export interface UserResidencesI {
  id: number;
  username: string;
  names: string;
  surnames: string;
  residences: Array<ResidencyI>;
}

export interface ResidencyI {
  residencyId: number;
  personId: number;
  block: string;
  town: string;
  isMain: boolean;
}

export interface MainResidencyI {
  id: number;
};

export interface UserRoleI {
  id: number;
  names: string;
  surnames: string;
  role: string;
  personId: number;
}
