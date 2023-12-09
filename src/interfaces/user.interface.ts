export interface UserI {
  id: number;
  names: string;
  surnames: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
}

export interface UserResidencesI {
  id:          number;
  username:     string;
  names:     string;
  surnames:   string;
  residences: Array<Residency>;
}

export interface Residency {
  residencyId: number;
  personId:    number;
  block:      string;
  town:        string;
  urbanization: string;
  isMain:  boolean;
}

export interface UserRoleI {
  id: number;
  names: string;
  surnames: string;
  role: string;
  personId: number;
}
