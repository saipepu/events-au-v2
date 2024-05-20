import { BadRequestException, Injectable, NotAcceptableException, NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant } from './schema/participant.schema';
import mongoose from 'mongoose';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Query } from 'express-serve-static-core'
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private participantModel: mongoose.Model<Participant>,
  ) {}

  async findAll(query: Query) {

    const participants = await this.participantModel.find(query)

    return { success: true, message: participants }
  }

  async findById(id: string) {

    if(!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException({ success: false, error: "Participant Id is invalid." })
    }

    const participant = await this.participantModel.findById(id)

    if(!participant) {
      throw new NotFoundException({ success: false, error: "participant not found."})
    }

    return { success: true, message: participant }

  }

  async create(body) {

    try {

      // check if the participant is already associated with the event
      let plist: any = await this.participantModel.find({ eventId: body.eventId })
      plist = plist.map((item,index) => item.userId.toString())
      
      if(plist.includes(body.userId.toString())) {
        return { success: false, error: "You have already requested to join the event."}
      }

      const participant = await this.participantModel.create(body)

      return { success: true, message: participant }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }
  }

  async updateStatus(participantId: string, status: string) {

    try {

      if(!mongoose.isValidObjectId(participantId)) {
        return { id: participantId, success: false, error: "Invalid participant id." }
      }

      await this.participantModel.findByIdAndUpdate(participantId, { status: status }, {
        new: true,
        runValidators: true,
      })

      return { id: participantId, success: true }

    } catch(err) {

      return { id: participantId, success: false, error: err }
    }
  }

  async leaveEvent(eventId: string, user: User) {

    try {

      const participant = await this.participantModel.findOne({ eventId: eventId, userId: user._id })
      console.log(participant, eventId)

      if(participant) {

        let participant = await this.participantModel.findOneAndUpdate({ eventId: eventId, userId: user._id },
          { status: 'participated'},
          {
            new: true,
            runValidators: true,
          }
        )

        return { success: true, message: participant }

      } else {

        return { success: false, message: "Partcipant id or event id is incorrect."}

      }



    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }
  }

}
