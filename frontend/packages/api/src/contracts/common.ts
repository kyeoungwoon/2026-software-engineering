export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  result: T;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type SpringPageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};
