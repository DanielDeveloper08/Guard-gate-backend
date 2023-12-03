export interface PaginationI {
  limit?: number;
  page?: number;
  search?: string;
}

export interface ResponsePaginationI<T> {
  records: Array<T>;
  meta: MetaI;
}

export interface MetaI {
  page: number;
  totalPages: number;
  totalRecords: number;
}
