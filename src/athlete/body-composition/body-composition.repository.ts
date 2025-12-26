import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BodyCompositionEntity } from './body-composition.entity';

@Injectable()
export class BodyCompositionRepository {
  constructor(
    @InjectRepository(BodyCompositionEntity)
    private readonly repo: Repository<BodyCompositionEntity>,
  ) {}

  async findByAthleteWithRelations(
    athleteId: string,
  ): Promise<BodyCompositionEntity[]> {
    return this.repo.find({
      where: { athleteId },
      relations: ['athlete'],
      order: { testDateTime: 'DESC' },
      take: 6,
    });
  }

  async findExistingByAthleteAndDates(
    athleteId: string,
    testDates: string[],
  ): Promise<BodyCompositionEntity[]> {
    if (!testDates || testDates.length === 0) {
      return [];
    }

    return this.repo.find({
      where: {
        athleteId,
        testDateTime: In(testDates),
      },
    });
  }

  async bulkCreate(
    records: Partial<BodyCompositionEntity>[],
  ): Promise<BodyCompositionEntity[]> {
    if (!records || records.length === 0) {
      return [];
    }

    const entities = this.repo.create(records);
    return this.repo.save(entities);
  }
}
