import { forwardRef, Module } from '@nestjs/common';
import { PollResultService } from './poll-result.service';
import { PollResultController } from './poll-result.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { PollResultSchema } from './schema/poll-result.schema';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ParticipantModule } from 'src/participant/participant.module';
import { UnitMemberModule } from 'src/unit-member/unit-member.module';
import { MailModule } from 'src/common/mail/mail.module';
import { OrganizerModule } from 'src/organizer/organizer.module';
import { AdminModule } from 'src/admin/admin.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'PollResult',
      schema: PollResultSchema
    }]),
    forwardRef(() => UserModule),
    forwardRef(() => ParticipantModule),
    UnitMemberModule,
    MailModule,
    forwardRef(() => OrganizerModule),
    forwardRef(() => EventModule),
    AdminModule,
  ],
  controllers: [PollResultController],
  providers: [PollResultService, UserService],
  exports: [PollResultService, MongooseModule]
})
export class PollResultModule {}
