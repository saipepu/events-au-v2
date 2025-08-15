import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RestrictedTokenSchema } from './schema/restrictedToken.schema';
import { AdminModule } from 'src/admin/admin.module';
import { UnitModule } from 'src/unit/unit.module';
import { UnitMemberModule } from 'src/unit-member/unit-member.module';
import { UnitMemberService } from 'src/unit-member/unit-member.service';
import { UnitMemberSchema } from 'src/unit-member/schema/unit-member.schema';
import { MailModule } from 'src/common/mail/mail.module';
import { PendingUserModule } from 'src/pending-user/pending-user.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RestrictedToken', schema: RestrictedTokenSchema },
      { name: 'UnitMember', schema: UnitMemberSchema }
    ]),
    AdminModule,
    MailModule,
    PendingUserModule,
    UnitModule,
    UnitMemberModule,
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: config.get<string | number>("JWT_EXPIRES"),
          }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UnitMemberService],
  exports: [PassportModule, JwtStrategy, AuthService]
})
export class AuthModule {}
