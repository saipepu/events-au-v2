import { EventService } from 'src/event/event.service';
import { EventUnitService } from 'src/event-unit/event-unit.service';
import { BadRequestException, forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Organizer } from './schema/organizer.schema';
import { Query } from 'express-serve-static-core'
import { CreateOrgDto } from './dto/create-org.dto';
import { ParticipantService } from 'src/participant/participant.service';
import { UpdateParticipantStatusManyDto, UpdateParticipantStatusSingleDto } from 'src/participant/dto/update-participant-status.dto';
import { updateEventUnitDto } from 'src/event-unit/dto/update-event-unit.dto';
import { stat } from 'fs';
import { MailService } from 'src/common/mail/mail.service';
import { UnitAdminService } from 'src/unit-admin/unit-admin.service';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectModel(Organizer.name)
    private organizerModel: mongoose.Model<Organizer>,
    @Inject(forwardRef(() => ParticipantService)) //<--- 
    private participantService: ParticipantService,
    private eventUnitService: EventUnitService,
    private mailService: MailService,
    private unitAdminService: UnitAdminService,
  ) {}

  // Get All Organizers
  async findAll(query: Query) {
  
    const organizers = await this.organizerModel.find(query).populate(['userId', 'eventId']).exec();

    return { success: true, message: organizers}
  }

  // Get Organizer by ID
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

  // Create Organizer
  async create(body: CreateOrgDto) {

    try {

      const org = await this.organizerModel.create(body)
      
      return { success: true, message: org }

    } catch(err) {

      throw new BadRequestException({ success: false, error: "Fail to create new organizer."})

    }
  }

  // Manage Participant
  async updateParticipantStatus(body: UpdateParticipantStatusManyDto | UpdateParticipantStatusSingleDto, updateMany: Boolean) {

    try {

      let { participantId, participantIds, status } = body as any
      if(status == 'accepted') {
        status = 'participating'
      }
      if(status == 'rejected') {
        status = 'rejected'
      }
      if(status == 'kicked') {
        status = 'kicked'
      }

      let participantEmails = []
      let participants = updateMany ? participantIds : [participantId]

      for(let i=0; i<participants.length; i++) {
        let participant = await this.participantService.findById(participants[i]) 
        let participantEmail = participant.message.email
        participantEmails.push(participantEmail)
      }

      await this.mailService.sendParitcipantUpdateStatus(participantEmails, status);

      let res: any
      if(updateMany) {
        res = await this.participantService.updateManyStatus(participantIds, status)
      } else {
        res = await this.participantService.updateSingleStatus(participantId, status)
      }
      return { success: true, message: res }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err})

    }
  }

  async updateEventUnit(eventId: string, body: updateEventUnitDto) {

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

            console.log("unitId: ", units[i])
            let unitAdmin = await this.unitAdminService.findByUnitId(units[i])
            console.log("unitAdmin : ", unitAdmin.message)
  
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
