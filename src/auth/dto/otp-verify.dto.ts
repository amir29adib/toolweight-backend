import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class OtpVerifyDto {
  @ApiProperty()
  @IsString()
  @Length(3, 150)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(4, 12)
  code: string;
}
