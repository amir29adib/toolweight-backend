import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class OtpLoginDto {
  @ApiProperty()
  @IsString()
  @Length(3, 150)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(6, 255)
  password: string;
}
