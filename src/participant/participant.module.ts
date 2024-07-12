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
import { PollService } from 'src/poll/poll.service';
import { PollResultService } from 'src/poll-result/poll-result.service';
import { PollModule } from 'src/poll/poll.module';
import { PollResultModule } from 'src/poll-result/poll-result.module';

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
    forwardRef(() => EventModule),
    forwardRef(() => PollModule),
    forwardRef(() => PollResultModule),
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService, MailService],
  exports: [ParticipantService]
})
export class ParticipantModule {}
