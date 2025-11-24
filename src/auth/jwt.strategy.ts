import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BlacklistTokenService } from 'src/blacklist/token/blacklist-token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly blacklist: BlacklistTokenService;

  constructor(cfg: ConfigService, blacklist: BlacklistTokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_SECRET'),
    });
    this.blacklist = blacklist;
  }
  async validate(payload: { sub: number; username: string; jti: string }) {
    if (payload?.jti) {
      const revoked = await this.blacklist.isBlacklisted(payload.jti);
      if (revoked) throw new UnauthorizedException('Token is revoked');
    }

    return { userId: payload.sub, username: payload.username };
  }
}
