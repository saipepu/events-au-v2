import { forwardRef, Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { Poll, PollSchema } from './schema/poll.schema';
import { PollOption, PollOptionSchema } from './schema/poll-option.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ParticipantModule } from 'src/participant/participant.module';
import { UnitMemberModule } from 'src/unit-member/unit-member.module';
import { MailModule } from 'src/common/mail/mail.module';
import { OrganizerModule } from 'src/organizer/organizer.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Poll.name, schema: PollSchema },
      { name: PollOption.name, schema: PollOptionSchema },
    ]),
    forwardRef(() => UserModule),
    ParticipantModule,
    UnitMemberModule,
    MailModule,
    OrganizerModule,
    AdminModule,
  ],
  controllers: [PollController],
  providers: [PollService, UserService],
  exports: [PollService],
})
export class PollModule {}
