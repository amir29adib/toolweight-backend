import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationQuery } from '../dto/pagination-query.dto';

@Injectable()
export class FiltersAllowedPipe implements PipeTransform {
  constructor(private readonly allowed: readonly string[]) {}
  transform(value: PaginationQuery): PaginationQuery {
    const v = value ?? ({} as PaginationQuery);

    let filters: any[] = [];
    const raw = (v as any).filters;

    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        filters = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        throw new BadRequestException(`'filters' must be valid JSON`);
      }
    } else if (Array.isArray(raw)) {
      filters = raw;
    } else if (raw && typeof raw === 'object') {
      filters = [raw];
    } else {
      filters = [];
    }

    filters = filters.filter(
      (f) => f && typeof f === 'object' && Object.keys(f).length,
    );

    for (const f of filters) {
      if (!this.allowed.includes(f.field)) {
        throw new BadRequestException(`Invalid filter field: ${f.field}`);
      }
      if (f.operator === 'in') {
        if (!Array.isArray(f.values) || f.values.length === 0) {
          throw new BadRequestException(
            `'in' requires non-empty values[] for field ${f.field}`,
          );
        }
      } else {
        if (typeof f.value !== 'string' || !f.value.length) {
          throw new BadRequestException(
            `'${f.operator}' requires non-empty value for field ${f.field}`,
          );
        }
      }
    }

    v.filters = filters as any;
    return v;
  }
}
