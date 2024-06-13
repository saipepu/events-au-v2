import { Module, forwardRef } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schema/event.schema';
import { OrganizerSchema } from 'src/organizer/schema/organizer.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { OrganizerService } from 'src/organizer/organizer.service';
import { ParticipantService } from 'src/participant/participant.service';
import { ParticipantSchema } from 'src/participant/schema/participant.schema';
import { EventUnitSchema } from 'src/event-unit/schema/event-unit.schema';
import { EventUnitService } from 'src/event-unit/event-unit.service';
import { OrganizerModule } from 'src/organizer/organizer.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { EventUnitModule } from 'src/event-unit/event-unit.module';
import { UnitModule } from 'src/unit/unit.module';
import { UserModule } from 'src/user/user.module';
import { MailService } from 'src/common/mail/mail.service';
import { UnitAdminModule } from 'src/unit-admin/unit-admin.module'; 
import { UserService } from 'src/user/user.service';
import { UnitMemberModule } from 'src/unit-member/unit-member.module';
import { UnitMemberService } from 'src/unit-member/unit-member.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Event", schema: EventSchema},
      { name: "Participant", schema: ParticipantSchema },
      { name: "EventUnit", schema: EventUnitSchema },
      { name: "Organizer", schema: OrganizerSchema }
    ]),
    UnitModule,
    UnitMemberModule,
    forwardRef(() => UserModule),
    UnitAdminModule,
  ],
  controllers: [EventController],
  providers: [EventService, OrganizerService, ParticipantService, EventUnitService, MailService, UserService, UnitMemberService],
  exports: [EventService]
})
export class EventModule {}
