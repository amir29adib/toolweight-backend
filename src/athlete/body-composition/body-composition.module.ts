import { Module } from '@nestjs/common';
import { BodyCompositionController } from './body-composition.controller';
import { BodyCompositionService } from './body-composition.service';
import { AthleteModule } from '../athlete.module';
import { BodyCompositionRepository } from './body-composition.repository';
import { BodyCompositionEntity } from './body-composition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BodyCompositionEntity]), AthleteModule],
  controllers: [BodyCompositionController],
  providers: [BodyCompositionService, BodyCompositionRepository],
})
export class BodyCompositionModule {}
