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
  usuario:     string;
  nombres:     string;
  apellidos:   string;
  residencias: Array<Residency>;
}

export interface Residency {
  idResidencia: number;
  idPersona:    number;
  manzana:      string;
  villa:        string;
  urbanizacion: string;
  esPrincipal:  boolean;
}
