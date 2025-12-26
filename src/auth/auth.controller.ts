import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OtpLoginDto } from './dto/otp-login.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cfg: ConfigService,
  ) {}

  @Post('login/otp-init')
  @ApiOperation({ summary: 'Start OTP login (send code)' })
  @ApiBody({ type: OtpLoginDto })
  @ApiOkResponse()
  async loginOtpInit(@Body() dto: OtpLoginDto) {
    return this.auth.loginInitOtp(dto.username, dto.password);
  }

  @Post('login/otp-verify')
  @ApiOperation({ summary: 'Verify OTP and return access token' })
  @ApiBody({ type: OtpVerifyDto })
  @ApiOkResponse()
  async loginOtpVerify(@Body() dto: OtpVerifyDto) {
    const { accessToken, user } = await this.auth.loginVerifyOtp(
      dto.username,
      dto.code,
    );
    return { ok: true, accessToken, user };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @Post('logout')
  @ApiOperation({ summary: 'Logout (add jwt token to blacklist)' })
  @ApiOkResponse()
  async logout(@Req() req: Request) {
    await this.auth.logout(req);

    return { ok: true };
  }
}
