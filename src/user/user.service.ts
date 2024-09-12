import { UnitMemberService } from './../unit-member/unit-member.service';
import { UnitService } from 'src/unit/unit.service';
import { User } from './schema/user.schema';
import {
  BadRequestException,
  forwardRef,
  Inject,
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
    @Inject(forwardRef(() => UnitMemberService)) //<--- 
    private unitMemberService: UnitMemberService,
    private mailService: MailService,
    @Inject(forwardRef(() => OrganizerService)) //<---
    private organizerService: OrganizerService,
  ) {}

  async findAll(query: Query) {
    const users = await this.userModel.find({ ...query, isDeleted: false });

    return { success: true, message: users };
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id, isDeleted: false });
      if(!user) throw new NotFoundException('User does not exist. (deleted or not found)');

      const organizer = await this.organizerService.findAll({ userId: id });
      let dto = {
        ...user.toObject(),
        isOrganizer: organizer?.message.length > 0 ? true : false,
      }
      return { success: true, message: dto};

    } catch (err) {
      throw new NotFoundException({ success: false, error: err.response.message });
    }
  }

  async update(id: string, body: any) {
    try {
      const user = await this.userModel.findOneAndUpdate({ _id: id, isDeleted: false }, body, {
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

      const _ = await this.participantService.findAll({ eventId, userId: user._id });
      if (_.message.length > 0) {
        throw new BadRequestException('User is already a participant of this event.');
      }

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
      return { success: false, error: err.response };
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

  async softDelete(id: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
      return { success: true, message: "Soft Delete User Successful." };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  async recover(id: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, { isDeleted: false, deletedAt: null }, { new: true });
      return { success: true, message: "Recover User Successful." };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

}
