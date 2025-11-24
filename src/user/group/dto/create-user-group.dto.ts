import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  ArrayUnique,
  IsInt,
} from 'class-validator';

export class CreateUserGroupDto {
  @ApiProperty()
  @IsString()
  @Length(2, 120)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  userGroupAccessIds?: number[];
}
