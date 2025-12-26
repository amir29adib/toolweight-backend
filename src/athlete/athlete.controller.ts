import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AthleteExistsGuard } from './guards/athlete-exists.guard';
import { FiltersAllowedPipe } from 'src/common/pipes/filters-allowed.pipe';
import { AthleteService } from './athlete.service';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';

@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('athletes')
export class AthleteController {
  private static readonly SEARCH_FIELDS: string[] = ['name'];

  constructor(private readonly svc: AthleteService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @Get()
  findAll(
    @Query(new FiltersAllowedPipe(AthleteController.SEARCH_FIELDS))
    query: PaginationQuery,
  ) {
    return this.svc.findAll(query);
  }
}
