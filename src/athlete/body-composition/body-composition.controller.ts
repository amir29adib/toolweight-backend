import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateBodyCompositionDto } from './dto/create-body-composition.dto';
import { BodyCompositionService } from './body-composition.service';
import { ApiAuthGuard } from 'src/auth/guards/api-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getHistoryBodyCompositionDto } from './dto/get-history-body-composition.dto';

@Controller('body-composition')
export class BodyCompositionController {
  constructor(private readonly svc: BodyCompositionService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Get body composition history for a single athlete',
  })
  @Get(':athleteId/history')
  getHistoryForAthlete(
    @Param('athleteId') athleteId: string,
  ): Promise<getHistoryBodyCompositionDto[]> {
    return this.svc.getHistoryForAthlete(athleteId);
  }

  @UseGuards(ApiAuthGuard)
  @ApiOperation({ summary: 'Bulk create body composition' })
  @ApiBody({ type: Array<CreateBodyCompositionDto> })
  @ApiCreatedResponse()
  @Post(':apiToken/bulk-create')
  create(@Body() dto: CreateBodyCompositionDto[]) {
    return this.svc.bulkCreate(dto);
  }
}
