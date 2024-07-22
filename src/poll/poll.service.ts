import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import mongoose from 'mongoose';
import { Poll } from './schema/poll.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { Query } from 'express-serve-static-core';
import { OrganizerService } from 'src/organizer/organizer.service';

@Injectable()
export class PollService {
  constructor(
    @InjectModel(Poll.name)
    private pollModel: mongoose.Model<Poll>,
    @Inject(forwardRef(() => UserService)) //<---
    private userService: UserService,
    private organizerService: OrganizerService
  ) {}

  async create(body: CreatePollDto, user: User) {
    try {
      const u = await this.userService.findById(user._id);
      console.log(body, u);

      let poll = await this.pollModel.create(body);
      return { success: true, message: poll };
    } catch (error) {
      throw new BadRequestException({ success: false, error: error });
    }
  }

  async findAll(query: Query) {
    const polls = await this.pollModel.find(query);

    return { success: true, message: polls };
  }

  async findByEventId(eventId: string) {
    try {
      const polls = await this.pollModel.find({ eventId: eventId });

      return { success: true, message: polls };
    } catch (error) {
      throw new BadRequestException({ success: false, error: error });
    }
  }

  async delete(pollId: string, user: User) {
    const poll = await this.pollModel.findOne({ _id: pollId });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // Get organizers for the event associated with the poll
    const organizers = await this.organizerService.findAll({ eventId: poll.eventId });
    console.log(organizers, user._id.toString());
    // Check if the user is an organizer for the event
    const isOrganizer = organizers.message.some(
      (organizer) => organizer.userId._id.toString() === user._id.toString()
    );

    if (!isOrganizer) {
      throw new NotFoundException('You do not have permission to delete this poll');
    }

    await this.pollModel.deleteOne({ _id: pollId });
    return { success: true,  message: poll};
  }
}
