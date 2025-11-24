import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { BlacklistTokenModule } from 'src/blacklist/token/blacklist-token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpTokenEntity } from './entities/otp-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpTokenEntity]),
    ConfigModule,
    UserModule,
    BlacklistTokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_EXPIRES', '1800s') },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
