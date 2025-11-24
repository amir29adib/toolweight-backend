import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { BlacklistTokenService } from 'src/blacklist/token/blacklist-token.service';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { OtpTokenEntity } from './entities/otp-token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
    private readonly blacklist: BlacklistTokenService,
    private readonly cfg: ConfigService,
    @InjectRepository(OtpTokenEntity)
    private readonly otpRepo: Repository<OtpTokenEntity>,
  ) {}

  async loginInitOtp(username: string, password: string) {
    const user = await this.users.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // const code = Math.floor(1000 + Math.random() * 9000).toString();
    const code = (1111).toString();

    const ttlMin = Number(this.cfg.get('OTP_EXPIRES_MIN', 5));

    const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);

    const previousOtp = await this.otpRepo.findOne({
      where: {
        userId: user.id,
        consumed: false,
        expiresAt: new Date(Date.now()),
      },
    });
    if (previousOtp) throw new BadRequestException('Previous OTP not consumed');

    await this.otpRepo
      .createQueryBuilder()
      .update(OtpTokenEntity)
      .set({ consumed: true })
      .where('"userId" = :uid AND consumed = false', { uid: user.id })
      .execute();

    const row = this.otpRepo.create({ userId: user.id, code, expiresAt });

    await this.otpRepo.save(row);

    return { ok: true };
  }

  async loginVerifyOtp(username: string, code: string) {
    const user = await this.users.findOneByUsername(username);
    const otp = await this.otpRepo.findOne({
      where: { userId: user.id, consumed: false },
      order: { createdAt: 'DESC' } as any,
    });
    if (!otp) throw new BadRequestException('OTP not found');

    if (otp.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired');
    }

    if (otp.attempts >= 5) throw new BadRequestException('Too many attempts');

    if (otp.code !== code) {
      await this.otpRepo.update({ id: otp.id }, { attempts: otp.attempts + 1 });
      throw new BadRequestException('Invalid code');
    }

    await this.otpRepo.update({ id: otp.id }, { consumed: true });

    const jti = randomUUID();
    const payload = { sub: user.id, username: user.username, jti };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.cfg.get('JWT_SECRET'),
      expiresIn: this.cfg.get('JWT_EXPIRES', '1800s'),
    });

    return { accessToken, user: { id: user.id, username: user.username } };
  }

  async logout(req: Request) {
    const auth = String(req.headers['authorization'] || '');
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (token) {
      const decoded: any = this.jwt.decode(token);
      const jti = decoded?.jti;
      const exp = decoded?.exp;

      if (jti && exp) {
        await this.blacklist.add(jti, exp);
      }
    }
  }
}
