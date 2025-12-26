import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { AthleteService } from '../athlete.service';

@Injectable()
export class AthleteExistsGuard implements CanActivate {
  constructor(
    @Inject(AthleteService) private readonly athleteService: AthleteService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const athleteId = request.params.athleteId;

    if (!athleteId) {
      return false;
    }

    await this.athleteService.findOne(athleteId);

    return true;
  }
}
