import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AthleteEntity } from './athlete.entity';
import { applyFilters } from 'src/common/utils/apply-filters.util';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { BodyCompositionEntity } from './body-composition/body-composition.entity';

@Injectable()
export class AthleteRepository {
  constructor(
    @InjectRepository(AthleteEntity)
    private readonly repo: Repository<AthleteEntity>,
  ) {}

  async findAllPaginated(opts: PaginationQuery) {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts.limit ?? 5));

    const allowedSort = ['id', 'name'];
    const colMap: Record<string, string> = {
      id: 'ath.id',
      name: 'ath.name',
    };

    const sortBy = allowedSort.includes(opts.sortBy ?? '')
      ? (opts.sortBy as string)
      : 'id';
    const sortOrder = (opts.sortOrder ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.repo
      .createQueryBuilder('ath')
      .leftJoin(
        (subQ) =>
          subQ
            .from(BodyCompositionEntity, 'bc')
            .select('bc.athlete_id', 'athlete_id')
            .addSelect('bc.height', 'height')
            .addSelect('bc.weight', 'weight')
            .addSelect('bc.bmi', 'bmi')
            .addSelect('bc.test_date_time', 'test_date_time')
            .where('bc.deletedAt IS NULL')
            .orderBy('bc.test_date_time', 'DESC')
            .limit(1),
        'lastbc',
        'lastbc.athlete_id = ath.id',
      )
      .addSelect(['lastbc.height', 'lastbc.weight', 'lastbc.bmi']);

    applyFilters(qb, colMap, opts.filters);

    const total = await qb.getCount();

    qb.orderBy(colMap[sortBy], sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const { raw, entities } = await qb.getRawAndEntities();

    const data = entities.map((ath, index) => {
      const r = raw[index] as any;

      return {
        id: ath.athleteId,
        sex: ath.sex,
        name: ath.name,
        height: r.height ?? null,
        weight: r.weight ?? null,
        weightClass: r.weight_class ?? null,
        bmi: r.bmi ?? null,
      };
    });

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

  findByAthleteId(athleteId: string) {
    return this.repo.findOne({
      where: { athleteId },
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
    });
  }

  create(data: Partial<AthleteEntity>) {
    return this.repo.create(data);
  }

  save(athlete: AthleteEntity) {
    return this.repo.save(athlete);
  }

  async updateById(id: string, data: Partial<AthleteEntity>) {
    await this.repo.update({ id }, data);
    return this.findById(id);
  }

  async removeById(id: string) {
    await this.repo.softDelete({ id });
  }

  async findByAthleteIds(athleteIds: string[]) {
    return await this.repo.find({
      where: { athleteId: In(athleteIds) },
      select: ['id', 'athleteId'],
    });
  }
}
