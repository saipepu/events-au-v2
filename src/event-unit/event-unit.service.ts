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

  // Find All Related Events and Units
  async findAll(query?: Query) {

    try {

      const eventUnits = await this.eventUnitModel.find().populate("eventId").populate("unitId").exec()

      return { success: true, message: eventUnits }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }

  }

  // Find Event by Unit ID
  async findByUnitId(unitId: string) {

    try {

      const eventUnit = await this.eventUnitModel.find({ unitId: unitId }).populate('unitId').populate('eventId').exec()
      if(eventUnit.length == 0) {
        throw new NotFoundException('No Event found for this Unit.')
      }
      
      return { success: true, message: eventUnit }
      
    } catch(err) {
      
      throw new NotFoundException('No Event found for this Unit.')
      // throw new BadRequestException({ success: false, error: err })
    }

  }

  // Find Unit by Event ID
  async findByEventId(eventId: string) {

    try {

      const result = await this.eventUnitModel.find({ eventId: eventId }).populate('unitId').populate('eventId').exec()

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })
    }

  }

  // Create Related Event Unit
  async create(body: CreateEventUnitDto) {

    try {

      const eventUnit = await this.eventUnitModel.create(body)

      return { success: true, message: eventUnit }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }

  }

  // Remove Related Event Unit
  // Invoke this method when the event or unit is removed
  async delete(eventUnitId: string) {

    try {

      const e = await this.eventUnitModel.deleteOne({ _id: eventUnitId })
      return { success: true, message: 'Remove successfully.'}

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }
  }
}
