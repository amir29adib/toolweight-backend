import { FilterRule } from '../dto/filter-rule.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
    sortBy: string;
    sortOrder: string;
    filters: FilterRule[];
  };
}
