import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export type FilterOperatorType =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'eq'
  | 'neq'
  | 'in';

export const FilterOperatorArray = [
  'contains',
  'startsWith',
  'endsWith',
  'eq',
  'neq',
  'in',
];

export class FilterRule {
  @ApiPropertyOptional({
    enum: FilterOperatorArray,
    description:
      'The comparison operator type for the field (e.g., equals or contains).',
  })
  @IsIn(FilterOperatorArray)
  operator: FilterOperatorType;

  @ApiPropertyOptional({ description: 'The database field name to filter on.' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiPropertyOptional({
    description:
      'The single value for single-value operators (e.g., eq, contains).',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of values for the "in" operator.',
    required: false,
  })
  @IsOptional()
  @IsArray()
  values?: string[];
}
