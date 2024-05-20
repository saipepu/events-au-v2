import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Unit } from './schema/unit.schema';
import { Query } from 'express-serve-static-core'

@Injectable()
export class UnitService {
  constructor(
    @InjectModel(Unit.name)
    private unitModel: mongoose.Model<Unit>,
  ) {}

  async findAll(query: Query)  {

    const units = await this.unitModel.find(query)

    return { success: true, message: units }

  }

  async findById(id: string) {

    try {

      const unit = await this.unitModel.findById(id)

      if (!unit) {
        throw new NotFoundException({ success: false, error: 'Unit not found' })
      }
      
      return { success: true, message: unit }

    } catch(err) {
      
      throw new NotFoundException({ success: false, error: `findUnitById ${err}` })

    }
  }

  async create(body) {
    
    try {

      const res = await this.unitModel.create(body)

      return { success: true, message: res }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }
  }

}
