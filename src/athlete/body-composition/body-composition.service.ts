import { Injectable } from '@nestjs/common';
import { CreateBodyCompositionDto } from './dto/create-body-composition.dto';
import { BodyCompositionEntity } from './body-composition.entity';
import { BodyCompositionRepository } from './body-composition.repository';
import { AthleteService } from '../athlete.service';
import { AthleteEntity } from '../athlete.entity';
import { getHistoryBodyCompositionDto } from './dto/get-history-body-composition.dto';

@Injectable()
export class BodyCompositionService {
  constructor(
    private readonly bodyCompositionRepository: BodyCompositionRepository,
    private readonly athleteService: AthleteService,
  ) {}

  async bulkCreate(
    dto: CreateBodyCompositionDto[],
  ): Promise<BodyCompositionEntity[]> {
    if (!dto || dto.length === 0) {
      return [];
    }

    const athleteIds = Array.from(
      new Set(dto.map((item) => item.athleteId).filter(Boolean)),
    );

    if (athleteIds.length === 0) {
      throw new Error('No athleteId found in bulk DTO payload');
    }

    const existingAthletes: AthleteEntity[] =
      await this.athleteService.findByAthleteIds(athleteIds);

    const existingAthleteObject: Record<string, string> = {};

    existingAthletes.forEach((a) => {
      existingAthleteObject[a.athleteId] = a.id;
    });

    const existingAthleteIds = new Set(
      existingAthletes.map((a) => a.athleteId),
    );

    const invalidAthletes = athleteIds.filter(
      (id) => !existingAthleteIds.has(id),
    );

    for (const id of invalidAthletes) {
      const newAthlete = await this.athleteService.createAthlete({
        athleteId: id,
        name: id,
        weightClass: 'دسته آزاد',
      });

      existingAthleteIds.add(newAthlete.athleteId);
      existingAthleteObject[newAthlete.athleteId] = newAthlete.id;
    }

    const groupedByAthlete: Record<string, CreateBodyCompositionDto[]> = {};

    for (const item of dto) {
      if (!groupedByAthlete[existingAthleteObject[item.athleteId]]) {
        groupedByAthlete[existingAthleteObject[item.athleteId]] = [];
      }
      groupedByAthlete[existingAthleteObject[item.athleteId]].push(item);
    }

    const finalInsertPayload: Partial<BodyCompositionEntity>[] = [];

    for (const athleteId of Object.keys(groupedByAthlete)) {
      const records = groupedByAthlete[athleteId];

      const incomingDates = Array.from(
        new Set(records.map((r) => r.testDateTime).filter((v) => !!v)),
      );

      const existing =
        await this.bodyCompositionRepository.findExistingByAthleteAndDates(
          athleteId,
          incomingDates,
        );

      const existingKeys = new Set(
        existing.map((e) => `${athleteId}::${e.testDateTime}`),
      );

      const toInsert = records
        .filter(
          (r) =>
            r.testDateTime &&
            !existingKeys.has(`${athleteId}::${r.testDateTime}`),
        )
        .map((r) => ({
          ...r,
          athleteId,
        }));

      finalInsertPayload.push(...toInsert);
    }

    if (finalInsertPayload.length === 0) {
      return [];
    }

    return this.bodyCompositionRepository.bulkCreate(finalInsertPayload);
  }

  async getHistoryForAthlete(
    athleteId: string,
  ): Promise<getHistoryBodyCompositionDto[]> {
    const rows =
      await this.bodyCompositionRepository.findByAthleteWithRelations(
        athleteId,
      );

    return rows.map((row) => {
      const a = row.athlete;

      return {
        name: a.name,
        weight_class: a.weightClass,
        sex: a.sex,
        test_date_time: row.testDateTime,
        height: row.height,
        weight: row.weight,
        lower_limit_weight_normal_range: row.lowerLimitWeightNormalRange,
        upper_limit_weight_normal_range: row.upperLimitWeightNormalRange,

        bmi_body_mass_index: row.bmi,
        lower_limit_bmi_normal_range: row.lowerLimitBmiNormalRange,
        upper_limit_bmi_normal_range: row.upperLimitBmiNormalRange,

        bmr_basal_metabolic_rate: row.bmr,
        lower_limit_bmr_normal_range: row.lowerLimitBmrNormalRange,
        upper_limit_bmr_normal_range: row.upperLimitBmrNormalRange,

        slm_soft_lean_mass: row.slm,
        lower_limit_slm_normal_range: row.lowerLimitSlmNormalRange,
        upper_limit_slm_normal_range: row.upperLimitSlmNormalRange,

        tbw_total_body_water: row.tbw,
        lower_limit_tbw_normal_range: row.lowerLimitTbwNormalRange,
        upper_limit_tbw_normal_range: row.upperLimitTbwNormalRange,

        protein: row.protein,
        lower_limit_protein_normal_range: row.lowerLimitProteinNormalRange,
        upper_limit_protein_normal_range: row.upperLimitProteinNormalRange,

        minerals: row.minerals,

        visceral_fat: row.visceralFat,
        lower_limit_visceral_fat_of_abdomen_normal_range:
          row.lowerLimitVisceralFatOfAbdomenNormalRange,
        upper_limit_visceral_fat_of_abdomen_normal_range:
          row.upperLimitVisceralFatOfAbdomenNormalRange,

        subcutaneous_fat: row.subcutaneousFat,
        lower_limit_subcutaneous_fat_of_abdomen_normal_range:
          row.lowerLimitSubcutaneousFatOfAbdomenNormalRange,
        upper_limit_subcutaneous_fat_of_abdomen_normal_range:
          row.upperLimitSubcutaneousFatOfAbdomenNormalRange,

        icw_intracellular_water: row.icw,
        lower_limit_icw_normal_range: row.lowerLimitIcwNormalRange,
        upper_limit_icw_normal_range: row.upperLimitIcwNormalRange,

        ecw_extracellular_water: row.ecw,
        lower_limit_ecw_normal_range: row.lowerLimitEcwNormalRange,
        upper_limit_ecw_normal_range: row.upperLimitEcwNormalRange,

        smm_skeletal_muscle_mass: row.smm,
        lower_limit_smm_normal_range: row.lowerLimitSmmNormalRange,
        upper_limit_smm_normal_range: row.upperLimitSmmNormalRange,

        pbf_percent_body_fat: row.pbf,
        lower_limit_pbf_normal_range: row.lowerLimitPbfNormalRange,
        upper_limit_pbf_normal_range: row.upperLimitPbfNormalRange,

        ffmi_fat_free_mass_index: row.ffmi,
        fmi_fat_mass_index: row.fmi,
        smi: row.smi,

        bfm_body_fat_mass: row.bfm,
        lower_limit_bfm_normal_range: row.lowerLimitBfmNormalRange,
        upper_limit_bfm_normal_range: row.upperLimitBfmNormalRange,
      };
    });
  }
}
