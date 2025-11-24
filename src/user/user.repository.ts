import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { applyFilters } from 'src/common/utils/apply-filters.util';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findAllPaginated(opts: PaginationQuery) {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
    const allowedSort = [
      'id',
      'username',
      'firstname',
      'lastname',
      'email',
      'mobileNumber',
      'nationalId',
      'createdAt',
      'updatedAt',
      'status',
    ];
    const colMap: Record<string, string> = {
      id: 'u.id',
      username: 'u.username',
      firstname: 'u.firstname',
      lastname: 'u.lastname',
      email: 'u.email',
      mobileNumber: 'u.mobileNumber',
      nationalId: 'u.nationalId',
      createdAt: 'u.createdAt',
      updatedAt: 'u.updatedAt',
      status: 'u.status',
    };
    const sortBy = allowedSort.includes(opts.sortBy ?? '')
      ? (opts.sortBy as string)
      : 'id';
    const sortOrder = (opts.sortOrder ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.repo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userGroup', 'userGroup');

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
      relations: ['userGroup'],
    });
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  findByMobileNumber(mobileNumber: string) {
    return this.repo.findOne({ where: { mobileNumber } });
  }

  create(user: Partial<UserEntity>) {
    return this.repo.create(user);
  }

  save(user: UserEntity) {
    return this.repo.save(user);
  }

  async updateById(id: number, data: Partial<UserEntity>) {
    await this.repo.update({ id }, data);
    return this.findById(id);
  }

  async removeById(id: number) {
    await this.repo.softDelete({ id });
  }
}
