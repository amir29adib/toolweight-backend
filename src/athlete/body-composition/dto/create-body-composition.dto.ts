import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, Min } from 'class-validator';

export class CreateBodyCompositionDto {
  @ApiProperty()
  @IsString()
  @Min(5)
  athleteId: string;

  @ApiProperty()
  @IsDateString()
  testDateTime: string;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitWeightNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitWeightNormalRange: number;

  @ApiProperty()
  @IsNumber()
  bmi: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitBmiNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitBmiNormalRange: number;

  @ApiProperty()
  @IsNumber()
  bmr: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitBmrNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitBmrNormalRange: number;

  @ApiProperty()
  @IsNumber()
  slm: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitSlmNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitSlmNormalRange: number;

  @ApiProperty()
  @IsNumber()
  tbw: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitTbwNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitTbwNormalRange: number;

  @ApiProperty()
  @IsNumber()
  protein: number;

  @ApiProperty()
  @IsNumber()
  minerals: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitProteinNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitProteinNormalRange: number;

  @ApiProperty()
  @IsNumber()
  visceralFat: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitVisceralFatOfAbdomenNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitVisceralFatOfAbdomenNormalRange: number;

  @ApiProperty()
  @IsNumber()
  subcutaneousFat: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitSubcutaneousFatOfAbdomenNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitSubcutaneousFatOfAbdomenNormalRange: number;

  @ApiProperty()
  @IsNumber()
  icw: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitIcwNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitIcwNormalRange: number;

  @ApiProperty()
  @IsNumber()
  ecw: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitEcwNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitEcwNormalRange: number;

  @ApiProperty()
  @IsNumber()
  pbf: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitPbfNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitPbfNormalRange: number;

  @ApiProperty()
  @IsNumber()
  smm: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitSmmNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitSmmNormalRange: number;

  @ApiProperty()
  @IsNumber()
  smi: number;

  @ApiProperty()
  @IsNumber()
  ffmi: number;

  @ApiProperty()
  @IsNumber()
  fmi: number;

  @ApiProperty()
  @IsNumber()
  bfm: number;

  @ApiProperty()
  @IsNumber()
  lowerLimitBfmNormalRange: number;

  @ApiProperty()
  @IsNumber()
  upperLimitBfmNormalRange: number;
}
