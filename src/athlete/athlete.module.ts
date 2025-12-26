import { Module } from '@nestjs/common';
import { AthleteController } from './athlete.controller';
import { AthleteService } from './athlete.service';
import { AthleteRepository } from './athlete.repository';
import { AthleteEntity } from './athlete.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AthleteEntity])],
  controllers: [AthleteController],
  providers: [AthleteService, AthleteRepository],
  exports: [AthleteService],
})
export class AthleteModule {}
