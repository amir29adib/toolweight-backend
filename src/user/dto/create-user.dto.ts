import {
  IsInt,
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsDateString,
  MinLength,
  IsEnum,
  IsArray,
  ValidateNested,
  IsMobilePhone,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { GenderEnum } from '../enums/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserMobileDto } from './user-mobile.dto';
import { UserRelativeMobileDto } from './user-mobile-relative.dto';
import { UserPhoneDto } from './user-phone.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsInt()
  userGroupId: number;

  @ApiProperty()
  @IsString()
  @Length(3, 150)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(6, 255)
  password: string;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  firstname: string;

  @ApiProperty()
  @IsString()
  @Length(3, 100)
  lastname: string;

  @ApiProperty()
  @IsString()
  @Length(10)
  nationalId: string;

  @ApiProperty()
  @IsDateString()
  birthdate: string;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsMobilePhone('fa-IR')
  mobileNumber: string;

  @ApiProperty()
  @IsString()
  profile: string;

  @ApiProperty()
  @MinLength(5)
  @IsString()
  address: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
