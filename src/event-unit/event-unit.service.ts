import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { EventUnit } from './schema/event-unit.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventUnitDto } from './dto/create-event-unit.dto';
import { Query } from 'express-serve-static-core'

@Injectable()
export class EventUnitService {
  constructor(
    @InjectModel(EventUnit.name)
    private eventUnitModel: mongoose.Model<EventUnit>,
  ) {}

  async findAll(query?: Query) {

    try {

      const eventUnits = await this.eventUnitModel.find().populate("eventId").populate("unitId").exec()

      return { success: true, message: eventUnits }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }

  }

  async findByUnitId(unitId) {

    try {

      const eventUnit = await this.eventUnitModel.find().populate('unitId').populate('eventId').exec()
      let result = eventUnit.map((item: any, index) => item.unitId._id == unitId ? item.eventId : '' )
      result = result.filter((item, index) => item != '')

      if(result.length == 0) {
        throw new NotFoundException('No Event found for this Unit.')
      }
      
      return { success: true, message: result }
      
    } catch(err) {
      
      throw new NotFoundException('No Event found for this Unit.')
      // throw new BadRequestException({ success: false, error: err })
    }

  }

  async findByEventId(eventId) {

    try {

      const eventUnit = await this.eventUnitModel.find().populate('unitId').populate('eventId').exec()
      let result = eventUnit.map((item: any, index) => item.eventId._id == eventId ? item.unitId : '' )
      result = result.filter((item, index) => item != '')

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })
    }

  }

  async create(body: CreateEventUnitDto) {

    try {

      const eventUnit = await this.eventUnitModel.create(body)

      return { success: true, message: eventUnit }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }

  }

  async delete(eventUnitId) {

    try {

      const e = await this.eventUnitModel.deleteOne({ _id: eventUnitId })
      return { success: true, message: 'Remove successfully.'}

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }
  }
}
