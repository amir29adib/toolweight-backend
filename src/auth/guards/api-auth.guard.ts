import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiToken = request.params.apiToken;

    const expectedToken = process.env.API_KEY;

    if (!apiToken || apiToken !== expectedToken) {
      throw new UnauthorizedException('Invalid API token');
    }

    return true;
  }
}
