export interface PaginatedResult<T> {
  items: T[];
  count: number;
  nextPage: number | null;
}