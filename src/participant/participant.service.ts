import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant } from './schema/participant.schema';
import mongoose from 'mongoose';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Query } from 'express-serve-static-core';
import { User } from 'src/user/schema/user.schema';
import { MailService } from 'src/common/mail/mail.service';
import { OrganizerService } from 'src/organizer/organizer.service';
import { PollService } from 'src/poll/poll.service';
import { PollResultService } from 'src/poll-result/poll-result.service';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private participantModel: mongoose.Model<Participant>,
    private mailService: MailService,
    @Inject(forwardRef(() => OrganizerService)) //<---
    private organizerService: OrganizerService,
    @Inject(forwardRef(() => PollService)) //<---
    private pollService: PollService,
    private pollResultService: PollResultService,
  ) {}

  // Find All Participants
  async findAll(query: Query) {
    const participants = await this.participantModel
      .find(query)
      .populate(['userId', 'eventId'])
      .exec();

    return { success: true, message: participants };
  }

  // Find Participant by ID
  async findById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException({
        success: false,
        error: 'Participant Id is invalid.',
      });
    }

    const participant = await this.participantModel
      .findById(id)
      .populate(['userId', 'eventId'])
      .exec();

    if (!participant) {
      throw new NotFoundException({
        success: false,
        error: 'Participant not found.',
      });
    }
    // console.log("Participant: ", participant);
    return { success: true, message: participant };
  }

  // Find Participant by User Id
  async findByUserId(userId: string) {

    if(!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException({ success: false, error: "Participant Id is invalid."})
    }

    const participant = await this.participantModel.find({ userId: userId }).populate(['userId','eventId']).exec();

    if(!participant) {
      throw new NotFoundException({ success: false, error: "Participant not found."})
    }

    return { success: true, message: participant }
  }

// Find Participant by Event Id
async findByEventId(eventId: string) {
  try {
    const participants = await this.participantModel
      .find({ eventId: eventId })
      .populate(['userId', 'eventId'])
      .exec();
      
    const detailedParticipants = await Promise.all(
      participants.map(async (participant) => {
        return (await this.findByIdWithDetails(participant._id.toString())).message;
      })
    );

    return { success: true, message: detailedParticipants };
  } catch (err) {
    throw new BadRequestException({ success: false, error: err });
  }
}
  // Create Participant
  async create(body: CreateParticipantDto) {
    try {
      // check if the participant is already associated with the event
      let plist: any = await this.participantModel.find({
        eventId: body.eventId,
        participantId: body.userId,
      });

      if (plist.length > 0) {
        if (plist[0].status == 'pending') {
          return {
            success: false,
            error: 'You have already requested to join the event.',
          };
        }
        if (plist[0].status == 'participating') {
          return {
            success: false,
            error: 'You have been approved to participate in this event.',
          };
        }
        if (plist[0].status == 'rejected') {
          return {
            success: false,
            error: 'Your request to join the event has been rejected.',
          };
        }
        if (plist[0].status == 'participated') {
          return {
            success: false,
            error: 'You have already participated in this event.',
          };
        }
      }

      const participant = await this.participantModel.create(body);

      return { success: true, message: participant };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  // Update Participant Status (Many)
  async updateManyStatus(participantIds: string[], status: string) {
    try {
      let res = await this.participantModel.updateMany(
        { _id: { $in: participantIds } },
        { status: status },
        {
          new: true,
          runValidators: true,
        },
      );

      return { success: true, message: 'Participant status updated.' };
    } catch (err) {
      return {
        success: false,
        error: 'Participant status upate failed! ' + err,
      };
    }
  }

  // Update Participant Status (Single)
  async updateSingleStatus(participantId: string, status: string) {
    try {
      const participant = await this.participantModel.findByIdAndUpdate(
        participantId,
        { status: status },
        {
          new: true,
          runValidators: true,
        },
      );
      return { success: true, message: participant };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  // Participant Leave Event
  async leaveEvent(eventId: string, user: User) {
    try {
      const participant = await this.participantModel.findOne({
        eventId: eventId,
        userId: user._id,
      });

      if (participant) {
        let participant = await this.participantModel.findOneAndUpdate(
          { eventId: eventId, userId: user._id },
          { status: 'participated' },
          {
            new: true,
            runValidators: true,
          },
        );

        const organizersResponse = await this.organizerService.findAll({
          eventId,
        });
        console.log(organizersResponse);
        if (organizersResponse.success) {
          const organizers = organizersResponse.message;
          console.log(organizers);
          const mailList: string[] = organizers.map(
            (organizer) => organizer.userId.email,
          );
          console.log(mailList);
          await this.mailService.sendLeaveEventNotification(
            mailList,
            user.email,
            'Organizer',
          );
        }
        return { success: true, message: participant };
      } else {
        return {
          success: false,
          message: 'Partcipant id or event id is incorrect.',
        };
      }
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  async findByIdWithDetails(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException({
        success: false,
        error: 'Participant Id is invalid.',
      });
    }

    const participant = await this.participantModel
      .findById(id)
      .populate(['userId', 'eventId'])
      .exec();

    if (!participant) {
      throw new NotFoundException({
        success: false,
        error: 'Participant not found.',
      });
    }

    try {
      const userId = participant.userId._id;
      const eventId = participant.eventId._id;

      const polls = await this.pollService.findByEventId(eventId);

      console.log('Polls: ', polls);

      let resultsList = [];

      for (const poll of polls.message) {
        const pollResults = await this.pollResultService.findByPollId(poll._id);
        
        console.log('Poll Results:', pollResults);
        for (const pollResult of pollResults.message) {
          if (pollResult.userId && (pollResult.userId as any)._id.equals(userId)) {
            resultsList.push({
              pollId: poll._id,
              result: pollResult.result,
            });
          }
        }
      }

      console.log(participant.toObject(), "Results List:");
      return {
        success: true,
        message: {
          ...participant.toObject()
          // nickname: participant.userId.nickname,
          // lineId: participant.userId.lineId,
          // resultsList,
        },
      };
    } catch (error) {
      throw new BadRequestException({ success: false, error: error });
    }
  }

  // // Find Participant by ID and Event Id
  // async findByIdAndEventId(participantId: string, eventId: string) {
  //   try {
  //     // Fetch poll ID using event ID
  //     const pollIdResponse = await this.pollService.findByEventId(eventId);
  //     console.log('Poll ID Response:', pollIdResponse);

  //     // Extract poll ID from the response
  //     const pollId = pollIdResponse.message[0]._id.toString();
  //     console.log('Poll ID:', pollId);

  //     // Fetch all poll results
  //     const pollResultsResponse = await this.pollResultService.findAll();
  //     const pollResults = (pollResultsResponse as { message: any[] }).message;
  //     console.log('Poll Results:', pollResults);

  //     // Find the matching poll result
  //     const matchingResult = pollResults.find(result => {
  //       const userId = (result.userId as { _id: string })._id.toString();
  //       const pollIdString = result.pollId.toString();
  //       console.log('Checking result:', result);
  //       console.log('userId:', userId, 'participantId:', participantId, 'pollIdString:', pollIdString, 'pollId:', pollId);
  //       return userId === participantId && pollIdString === pollId;
  //     });

  //     return { success: true, message: matchingResult };

  //   } catch (err) {
  //     throw new BadRequestException({ success: false, error: err });
  //   }
  // }
}
