import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserGroupEntity } from './user-group.entity';
import { UserGroupAccessEntity } from './access/access.entity';
import { applyFilters } from 'src/common/utils/apply-filters.util';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UserGroupRepository {
  constructor(
    @InjectRepository(UserGroupEntity)
    private readonly repo: Repository<UserGroupEntity>,
    @InjectRepository(UserGroupAccessEntity)
    private readonly accessRepo: Repository<UserGroupAccessEntity>,
  ) {}

  async findAllPaginated(opts: PaginationQuery) {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
    const allowedSort = ['id', 'name', 'isAdmin', 'createdAt', 'updatedAt'];
    const colMap: Record<string, string> = {
      id: 'g.id',
      name: 'g.name',
      isAdmin: 'g.isAdmin',
      createdAt: 'g.createdAt',
      updatedAt: 'g.updatedAt',
    };
    const sortBy = allowedSort.includes(opts.sortBy ?? '')
      ? (opts.sortBy as string)
      : 'id';
    const sortOrder = (opts.sortOrder ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.repo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.access', 'access')
      .leftJoinAndSelect('g.users', 'users');

    applyFilters(qb, colMap, opts.filters);

    const total = await qb.getCount();
    const data = await qb
      .orderBy(colMap[sortBy], sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pageCount: Math.ceil(total / limit),
        sortBy,
        sortOrder,
        filters: opts.filters ?? [],
      },
    };
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['access', 'users'],
    });
  }

  findByUserGroupName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  create(data: Partial<UserGroupEntity>) {
    return this.repo.create(data);
  }

  save(group: UserGroupEntity) {
    return this.repo.save(group);
  }

  async updateById(id: number, data: Partial<UserGroupEntity>) {
    await this.repo.update({ id }, data);
    return this.findById(id);
  }

  async removeById(id: number) {
    await this.repo.softDelete({ id });
  }

  async loadAccess(ids: number[] = []) {
    if (!ids.length) return [];
    return this.accessRepo.find({ where: { id: In(ids) } });
  }
}
