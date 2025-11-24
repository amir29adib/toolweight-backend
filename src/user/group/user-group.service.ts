import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserGroupRepository } from './user-group.repository';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UserGroupService {
  constructor(private readonly groups: UserGroupRepository) {}

  async findAll(p: PaginationQuery) {
    return this.groups.findAllPaginated(p);
  }

  async findOne(id: number) {
    const g = await this.groups.findById(id);
    if (!g) throw new NotFoundException('UserGroup not found');
    return g;
  }

  async create(dto: CreateUserGroupDto) {
    const existing = await this.groups.findByUserGroupName(dto.name);
    if (existing) throw new ConflictException('Group name already exists');
    const access = await this.groups.loadAccess(dto.userGroupAccessIds);
    const entity = this.groups.create({
      name: dto.name,
      isAdmin: !!dto.isAdmin,
      access,
    });
    return this.groups.save(entity);
  }

  async update(id: number, dto: UpdateUserGroupDto) {
    const g = await this.findOne(id);
    if (dto.name && dto.name !== g.name) {
      const nameClash = await this.groups.findByUserGroupName(dto.name);
      if (nameClash && nameClash.id !== id) {
        throw new ConflictException('Group name already exists');
      }
    }
    if (dto.userGroupAccessIds) {
      const access = await this.groups.loadAccess(dto.userGroupAccessIds);
      g.access = access;
    }
    if (dto.name !== undefined) g.name = dto.name;
    if (dto.isAdmin !== undefined) g.isAdmin = dto.isAdmin;
    return this.groups.save(g);
  }

  async remove(id: number) {
    await this.groups.removeById(id);
    return { success: true };
  }
}
