import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UserGroupService } from './user-group.service';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { FiltersAllowedPipe } from 'src/common/pipes/filters-allowed.pipe';

@ApiTags('UserGroups')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('user/groups')
export class UserGroupController {
  private static readonly SEARCH_FIELDS: string[] = ['name'];

  constructor(private readonly svc: UserGroupService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @Get()
  findAll(
    @Query(new FiltersAllowedPipe(UserGroupController.SEARCH_FIELDS))
    query: PaginationQuery,
  ) {
    return this.svc.findAll(query);
  }

  @ApiOperation({ summary: 'Get user group by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @ApiOperation({ summary: 'Create user group' })
  @ApiBody({ type: CreateUserGroupDto })
  @ApiCreatedResponse()
  @Post()
  create(@Body() dto: CreateUserGroupDto) {
    return this.svc.create(dto);
  }

  @ApiOperation({ summary: 'Update user group' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserGroupDto })
  @ApiOkResponse()
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserGroupDto,
  ) {
    return this.svc.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete user group' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
