import { SelectQueryBuilder } from 'typeorm';
import { FilterRule } from '../dto/filter-rule.dto';

type ObjectLiteral = { [key: string]: any };

export function applyFilters<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  colMap: Record<string, string>,
  filters?: FilterRule[],
) {
  let idx = 0;
  for (const f of filters ?? []) {
    const col = colMap[f.field];
    if (!col) continue;
    const p = `p${idx++}`;
    switch (f.operator) {
      case 'contains':
        qb.andWhere(`${col} ILIKE :${p}`, { [p]: `%${f.value}%` });
        break;
      case 'startsWith':
        qb.andWhere(`${col} ILIKE :${p}`, { [p]: `${f.value}%` });
        break;
      case 'endsWith':
        qb.andWhere(`${col} ILIKE :${p}`, { [p]: `%${f.value}` });
        break;
      case 'eq':
        qb.andWhere(`${col} = :${p}`, { [p]: f.value });
        break;
      case 'neq':
        qb.andWhere(`${col} <> :${p}`, { [p]: f.value });
        break;
      case 'in':
        qb.andWhere(`${col} IN (:...${p})`, { [p]: f.values ?? [] });
        break;
    }
  }
}
