import { Injectable, NotFoundException } from '@nestjs/common';
import { AthleteEntity } from './athlete.entity';
import { AthleteRepository } from './athlete.repository';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class AthleteService {
  constructor(private readonly athletes: AthleteRepository) {}

  async findAll(p: PaginationQuery) {
    return this.athletes.findAllPaginated(p);
  }

  async createAthlete(data: Partial<AthleteEntity>): Promise<AthleteEntity> {
    const athlete = this.athletes.create(data);
    return this.athletes.save(athlete);
  }

  async findOneByAthleteId(athleteId: string): Promise<AthleteEntity> {
    const athlete = await this.athletes.findByAthleteId(athleteId);
    if (!athlete) throw new NotFoundException('Athlete not found');
    return athlete;
  }

  async findOne(id: string): Promise<AthleteEntity> {
    const athlete = await this.athletes.findByAthleteId(id);
    if (!athlete) throw new NotFoundException('Athlete not found');
    return athlete;
  }

  async findByAthleteIds(athleteIds: string[]): Promise<AthleteEntity[]> {
    return this.athletes.findByAthleteIds(athleteIds);
  }
}
