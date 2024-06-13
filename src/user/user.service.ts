import { UnitMemberService } from './../unit-member/unit-member.service';
import { UnitService } from 'src/unit/unit.service';
import { User } from './schema/user.schema';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core'
import { CreateParticipantDto } from 'src/participant/dto/create-participant.dto';
import { ParticipantService } from 'src/participant/participant.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private participantService: ParticipantService,
    private unitMemberService: UnitMemberService
  ) {}

  async findAll(query: Query) {

    const users = await this.userModel
        .find(query)
    
    let result: any = users
    for(let i=0; i<result.length; i++) {

      const { success, message }: { success: boolean, message: any } = await this.unitMemberService.findByUserId(result[i]._id.toString())
      // success and unitIds

      let unitNames = []
      for(let j=0; j<message.length; j++) {
        unitNames.push(message[j].name)
      }

      result[i] = {...result[i].toObject(), units: unitNames }
    }

    return { success: true, message: result }
  }

  async findById(id: string) {

    try {
      const user = await this.userModel.findById(id)

      if(user) {
        return { success: true, message: user }
      } else {
        throw new NotFoundException("User with this ID does not exist.")
      }

      
    } catch(err) {
      
      throw new NotFoundException({ success: false, error: err })

    }
  }

  async update(id: string, body: any) {
      
    try {
      const user = await this.userModel.findByIdAndUpdate(id, body,{
        new: true,
        runValidators: true,
      })
      return { success: true, message: user }
    } catch(err) {
      throw new BadRequestException({ success: false, error: err })
    }
  }

  async joinEvent(eventId: string, user: User) {

    try {

      let participantDto = {
        email: user.email,
        phone: user.phone,
        status: "pending",
        userId: user._id,
        eventId: eventId
      }
        
      return this.participantService.create(participantDto)

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }
  }

  async joinUnit(unitId: string, user: User) {

    try {

      let unitMemberDto = {
        userId: user._id,
        unitId: unitId
      }

      return this.unitMemberService.create(unitMemberDto)

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }

  }

}
