import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipantSchema } from './schema/participant.schema';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OrganizerModule } from 'src/organizer/organizer.module';
import { MailService } from 'src/common/mail/mail.service';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Participant", schema: ParticipantSchema },
    ]),
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
    }),
    forwardRef(() => OrganizerModule),
    forwardRef(() => EventModule) //<--- 
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService, MailService],
  exports: [ParticipantService]
})
export class ParticipantModule {}
