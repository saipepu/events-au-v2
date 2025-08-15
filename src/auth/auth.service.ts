import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { PROVIDER } from './dto/google-login.dto';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { SetUpPasswordDto } from './dto/setup-password.dto';
import { MailService } from 'src/common/mail/mail.service';
import { UserAuthLevel } from 'src/user/schema/user.schema';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async signup(dto: SignUpDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser && existingUser.authLevel !== UserAuthLevel.UNVERIFIED) {
      throw new BadRequestException('Email already exists');
    }

    const otp = await this.issueOtp({ expiresIn: 5 * 60 });
    await this.mailService.sendOTPForEmailVerification(dto.email, otp.otp, 5);

    // register user as unverified
    if (existingUser) {
      existingUser.otp = {
        code: otp.otp,
        expiration: otp.otpExpirationTime,
      };
      await existingUser.save();
    } else {
      await this.userService.create({
        firstName: dto.firstName,
        email: dto.email,
        authLevel: UserAuthLevel.UNVERIFIED,
        otp: {
          code: otp.otp,
          expiration: otp.otpExpirationTime,
        },
      });
    }

    return {
      success: true,
      message: {
        message: 'OTP sent to ' + dto.email + ' successfully',
      },
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.otp.code !== dto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    user.otp = null;
    user.authLevel = UserAuthLevel.NEW;
    await user.save();

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  async setUpPassword(dto: SetUpPasswordDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.authLevel == UserAuthLevel.UNVERIFIED) throw new UnauthorizedException('Email not verified. Sign Up with your email to verify.');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();

    return {
      success: true,
      message: {
        message: 'Password set up successfully',
        user: user,
        tokens: await this.generateTokens(user._id, user.email),
      },
    };
  }

  async login(dto: SignInDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    try {
      const isMatch = await bcrypt.compare(dto.password, user.hashedPassword);

      if (!isMatch) {
        throw new BadRequestException('Invalid password.');
      }

      return {
        success: true,
        message: {
          tokens: await this.generateTokens(user._id, user.email),
          user,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err.response ? err.response.message : err,
      };
    }
  }

  /**
   * Validate ID token from frontend (Google / Apple)
   */
  async validateOAuthIdToken(provider: PROVIDER, idToken: string) {
    let oauthUser: any;

    if (provider === PROVIDER.GOOGLE) {
      oauthUser = await this.verifyGoogleIdToken(idToken);
    } else if (provider === PROVIDER.APPLE) {
      oauthUser = await this.verifyAppleIdToken(idToken);
    } else {
      throw new UnauthorizedException('Unsupported OAuth provider');
    }

    return this.validateOAuthLogin(oauthUser);
  }

  /**
   * Verify Google ID token
   */
  private async verifyGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Invalid Google ID token');
      return {
        provider: 'google' as const,
        providerId: payload['sub'],
        email: payload['email'],
        firstName: payload['given_name'],
        lastName: payload['family_name'],
        picture: payload['picture'],
      };
    } catch (error) {
      console.error('Error verifying Google ID token:', error);
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }

  /**
   * Verify Apple ID token
   */
  private async verifyAppleIdToken(idToken: string) {
    try {
      const applePublicKey = process.env.APPLE_PUBLIC_KEY; // replace with your method of fetching Apple JWKS
      const payload: any = jwt.verify(idToken, applePublicKey, {
        algorithms: ['RS256'],
      });

      return {
        provider: 'apple' as const,
        providerId: payload.sub,
        email: payload.email,
        firstName: payload['given_name'],
        lastName: payload['family_name'],
        picture: null, // Apple does not provide profile pictures
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid Apple ID token');
    }
  }

  /**
   * Find or create user, then issue JWTs
   */
  private async validateOAuthLogin(oauthUser: any) {
    let user = await this.userService.findByProviderId(
      oauthUser.provider,
      oauthUser.providerId,
    );

    if (!user && oauthUser.email) {
      // Check if email already exists
      user = await this.userService.findByEmail(oauthUser.email);
      if (user) {
        // Link new provider
        console.log('Linking new provider:', oauthUser.provider);
        user = await this.userService.linkProvider(
          user._id,
          oauthUser.provider,
          oauthUser.providerId,
        );
      } else {
        // Create new user
        console.log('Creating new user for OAuth login');
        user = await this.userService.createOAuthUser(oauthUser);
      }
    }

    if (!user) throw new UnauthorizedException('Unable to authenticate user');

    return {
      success: true,
      message: {
        user: user,
        tokens: await this.generateTokens(user._id, user.email),
      },
    };
  }

  /**
   * Generate access & refresh tokens
   */
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async issueOtp({
    expiresIn = 5 * 60,
  }: {
    expiresIn?: number;
  }): Promise<{ otp: string; otpExpirationTime: Date }> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit OTP
    const otpExpirationTime = new Date();
    otpExpirationTime.setSeconds(otpExpirationTime.getSeconds() + expiresIn);
    return { otp, otpExpirationTime };
  }
}
