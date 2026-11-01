export type ApiResponse<T> = {
  results: T;
};

export type PageParams = {
  page: number;
  pageSize: number;
};

export type Pagination = PageParams & {
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: Pagination;
};

export type Result = {
  name: string;
  message: string;
};
