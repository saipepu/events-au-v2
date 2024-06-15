import { EventService } from 'src/event/event.service';
import { EventUnitService } from 'src/event-unit/event-unit.service';
import { BadRequestException, forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Organizer } from './schema/organizer.schema';
import { Query } from 'express-serve-static-core'
import { CreateOrgDto } from './dto/create-org.dto';
import { ParticipantService } from 'src/participant/participant.service';
import { UpdateParticipantStatusDto } from 'src/participant/dto/update-status-participant.dto';
import { updateEventUnitDto } from 'src/event-unit/dto/update-event-unit.dto';
import { stat } from 'fs';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectModel(Organizer.name)
    private organizerModel: mongoose.Model<Organizer>,
    @Inject(forwardRef(() => ParticipantService)) //<--- 
    private participantService: ParticipantService,
    private eventUnitService: EventUnitService,
    private mailService: MailService,
  ) {}

  async findAll(query: Query) {
  
    console.log(query)
    const organizers = await this.organizerModel.find(query)
                                .populate(["userId", "eventId"])
                                .exec();

    return { success: true, message: organizers}
  }

  async findById(id: string) {

    if(!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException({ success: false, error: "Organizer Id is invalid."})
    }

    const organizer = await (await this.organizerModel.findById(id)).populate(["userId", "eventId"]);

    if(!organizer) {
      throw new NotFoundException({ success: false, error: "Organizer not found."})
    }

    return { success: true, message: organizer }
  }

  async create(body: CreateOrgDto) {

    try {

      const org = await this.organizerModel.create(body)
      
      return { success: true, message: org }

    } catch(err) {

      throw new BadRequestException({ success: false, error: "Fail to create new organizer."})

    }
  }

  async manageParticipant(body: UpdateParticipantStatusDto) {

    try {

      let { participants, status } = body

      if(status == 'accepted') {
        status = 'participating'
      }
      if(status == 'rejected') {
        status = 'rejected'
      }
      if(status == 'kicked') {
        status = 'kicked'
      }

      let result = []
      let participantEmails = []

      for(let i=0; i<participants.length; i++) {
        let res = await this.participantService.updateStatus(participants[i], status)
        console.log(participants[i])
        let participant = await this.participantService.findById(participants[i]) 
        let participantEmail = participant.message.email
        participantEmails.push(participantEmail)
        result.push(res)
      }

      console.log(participantEmails)
      await this.mailService.sendParitcipantUpdateStatus(participantEmails, status);

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err})

    }
  }

  async manageEventUnit(eventId: string, body: updateEventUnitDto) {

    try {

      let result = []
      let units = body.units
      let action = body.action
      for(let i=0; i<units.length; i++) {

        let { success, message} = await this.eventUnitService.findAll()

        let e = message.filter((item: any, index) => item.eventId._id == eventId && item.unitId._id == units[i])
        console.log(i, e.length, result)

        // add units
        if(action == 'add') {

          if(e.length > 0) {
  
            let r = { unitId: units[i], success: false, error: "This event is already belong to this unit."}
            result.push(r)
  
          } else {
  
            let { success, message } = await this.eventUnitService.create({ eventId: eventId, unitId: units[i]})
            if(success) {
              let r = { unitId: units[i], success: true, message: "Added successfully."}
              result.push(r)
            }
  
          }

        }

        // remove units
        if(action == 'remove') {
          
          if(e.length > 0) {

            let { success, message } = await this.eventUnitService.delete(e[0]._id)
            if(success) {
              let r = { unitId: units[i], success: true, message: "Remove successfully."}
              result.push(r)
            }
            
          } else {
  
            console.log('nth to remove')
            let r = { unitId: units[i], success: false, error: "This event is not related with this unit."}
            result.push(r)
  
          }
  
        }

      }

      return { success: true, message: result}


    } catch(err) {

      throw new BadRequestException({ success: false, error: err})

    }

  }

}
