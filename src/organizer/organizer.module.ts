import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizerSchema } from './schema/organizer.schema';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserSchema } from 'src/user/schema/user.schema';
import { UnitModule } from 'src/unit/unit.module';
import { UserModule } from 'src/user/user.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { EventModule } from 'src/event/event.module';
import { EventUnitModule } from 'src/event-unit/event-unit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Organizer", schema: OrganizerSchema },
      { name: "User", schema: UserSchema },
    ]),
    ParticipantModule,
    EventUnitModule,
    UnitModule,
    UserModule,
    EventModule,
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
  controllers: [OrganizerController],
  providers: [OrganizerService, JwtStrategy],
  exports: [OrganizerService]
})
export class OrganizerModule {}
