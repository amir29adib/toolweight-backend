import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { FilterRule } from './filter-rule.dto';

export class PaginationQuery {
  @ApiPropertyOptional({
    default: 1,
    description: 'The requested page number.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    default: 20,
    description: 'The maximum number of items per page (Max 100).',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(100)
  @IsOptional()
  limit: number = 20;

  @ApiPropertyOptional({ description: 'The field to sort the results by.' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    default: 'DESC',
    enum: ['ASC', 'DESC'],
    description: 'The sorting direction.',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    type: [FilterRule],
    description: 'Array of filtering rules to apply to the data.',
    required: false,
    example: [
      { operator: 'contains', field: 'username', value: 'ami' },
      { operator: 'eq', field: 'email', value: 'ami@example.com' },
    ],
  })
  @IsOptional()
  @Type(() => FilterRule)
  filters?: FilterRule[];
}
