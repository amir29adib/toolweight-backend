import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  ArrayMaxSize,
  IsString,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class GetPrivateUrlsDto {
  @ApiProperty()
  @IsArray()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  keys: string[];

  @ApiPropertyOptional({
    description: 'Expiration time in seconds (min: 1, max: 300)',
    example: 300,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(300)
  expiresInSeconds?: number;
}
