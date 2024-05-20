import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { ParticipantService } from 'src/participant/participant.service';
import { ParticipantSchema } from 'src/participant/schema/participant.schema';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UnitMemberModule } from 'src/unit-member/unit-member.module';
import { UnitModule } from 'src/unit/unit.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Participant', schema: ParticipantSchema }
    ]),
    EventModule,
    AuthModule,
    UnitMemberModule,
    UnitModule,
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
  controllers: [UserController],
  providers: [UserService, ParticipantService],
  exports: [UserService]
})
export class UserModule {}
