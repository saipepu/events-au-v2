import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RestrictedToken } from './schema/restrictedToken.schema';
import { SignOutDto } from './dto/signOut.dto';
import { OAuthLoginDto } from './dto/google-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { SetUpPasswordDto } from './dto/setup-password.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@ApiExtraModels(
  SignUpDto,
  SignInDto,
  RestrictedToken,
  SignOutDto,
  OAuthLoginDto,
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Unified endpoint for frontend-driven OAuth login (Google / Apple)
   */
  @Post('oauth-login')
  async oauthLogin(@Body() dto: OAuthLoginDto) {
    const { provider, idToken } = dto;

    if (!provider || !idToken) {
      throw new BadRequestException('Provider and idToken are required');
    }

    const tokens = await this.authService.validateOAuthIdToken(
      provider,
      idToken,
    );
    return tokens; // { accessToken, refreshToken }
  }

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('login')
  async login(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  @Post('set-up-password')
  async setUpPassword(@Body() dto: SetUpPasswordDto) {
    return this.authService.setUpPassword(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  async getMe(
    @Req() req
  ) {
    return req.user;
  }
}
