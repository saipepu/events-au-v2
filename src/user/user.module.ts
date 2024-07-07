import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { ParticipantService } from 'src/participant/participant.service';
import { ParticipantSchema } from 'src/participant/schema/participant.schema';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UnitMemberModule } from 'src/unit-member/unit-member.module';
import { UnitModule } from 'src/unit/unit.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/common/mail/mail.service';
import { EventService } from 'src/event/event.service';
import { OrganizerService } from 'src/organizer/organizer.service';
import { OrganizerSchema } from 'src/organizer/schema/organizer.schema';
import { EventUnitSchema } from 'src/event-unit/schema/event-unit.schema';
import { EventSchema } from 'src/event/schema/event.schema';
import { UnitAdminSchema } from 'src/unit-admin/schema/unit-admin.schema';
import { EventUnitService } from 'src/event-unit/event-unit.service';
import { UnitAdminService } from 'src/unit-admin/unit-admin.service';
import { UnitSchema } from 'src/unit/schema/unit.schema';
import { UnitMemberSchema } from 'src/unit-member/schema/unit-member.schema';
import { AdminSchema } from 'src/admin/schema/admin.schema';
import { UnitMemberService } from 'src/unit-member/unit-member.service';
import { AdminService } from 'src/admin/admin.service';
import { UnitService } from 'src/unit/unit.service';
import { PollSchema } from 'src/poll/schema/poll.schema';
import { PollModule } from 'src/poll/poll.module';
import { PollService } from 'src/poll/poll.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Participant', schema: ParticipantSchema },
      { name: "Organizer", schema: OrganizerSchema },
      { name: "EventUnit", schema: EventUnitSchema },
      { name: "Event", schema: EventSchema },
      { name: "UnitAdmin", schema: UnitAdminSchema },
      { name: "Unit", schema: UnitSchema},
      { name: "UnitMember", schema: UnitMemberSchema },
      { name: "Admin", schema: AdminSchema },
      { name: 'Poll', schema: PollSchema },
    ]),
    EventModule,
    AuthModule,
    UnitMemberModule,
    UnitModule,
    PollModule,
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
  providers: [UserService, ParticipantService, PollService, MailService, EventService, OrganizerService, EventUnitService, EventService, UnitAdminService, UnitMemberService, AdminService, UnitService],
  exports: [UserService, MongooseModule]
})
export class UserModule {}
