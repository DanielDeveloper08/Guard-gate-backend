export interface RoleI {
  id: number;
  name: string;
  operations: Array<OperationI>;
}

interface OperationI {
  id: number;
  name: string;
  route: string;
}

export interface UpdateRoleDTO {
  name: string;
  operationsIds: Array<number>;
}
