import { UnitMemberService } from './../unit-member/unit-member.service';
import { UnitService } from 'src/unit/unit.service';
import { User } from './schema/user.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { CreateParticipantDto } from 'src/participant/dto/create-participant.dto';
import { ParticipantService } from 'src/participant/participant.service';
import { MailService } from 'src/common/mail/mail.service';
import { OrganizerService } from 'src/organizer/organizer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private participantService: ParticipantService,
    private unitMemberService: UnitMemberService,
    private mailService: MailService,
    private organizerService: OrganizerService,
  ) {}

  async findAll(query: Query) {
    const users = await this.userModel.find(query);

    return { success: true, message: users };
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById(id);

      const organizer = await this.organizerService.findAll({ userId: id });

      console.log(organizer)

      let dto = {
        ...user.toObject(),
        isOrganizer: organizer?.message.length > 0 ? true : false,
      }

      if (user) {
        return { success: true, message: dto};
      } else {
        throw new NotFoundException('User with this ID does not exist.');
      }

    } catch (err) {
      throw new NotFoundException({ success: false, error: err });
    }
  }

  async update(id: string, body: any) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      return { success: true, message: user };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  async joinEvent(eventId: string, user: User) {
    try {
      let dto: CreateParticipantDto = {
        eventId: eventId,
        userId: user._id,
      };

      // // Find the organizer for the event
      // console.log(eventId)
      const organizersResponse = await this.organizerService.findAll({
        eventId,
      });
      // console.log(organizersResponse)
      if (organizersResponse.success) {
        const organizers = organizersResponse.message;
        const mailList: string[] = organizers.map(
          (organizer) => organizer.userId.email,
        );
        console.log(mailList);
        await this.mailService.sendEventJoinNotification(
          mailList,
          user.email,
          'Organizer',
        );
      }
      return this.participantService.create(dto);
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  async joinUnit(unitId: string, user: User) {
    try {
      let unitMemberDto = {
        userId: user._id,
        unitId: unitId,
      };

      return this.unitMemberService.create(unitMemberDto);
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }
}
