import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { UnitMember } from './schema/unit-member.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUnitMemberDto } from './dto/create-unit-member.dto';

@Injectable()
export class UnitMemberService {
  constructor(
    @InjectModel(UnitMember.name)
    private unitMemberModel: mongoose.Model<UnitMember>,
  ) {}

  async findByUserId(userId) {

    try {

      const unitMembers = await this.unitMemberModel.find().populate('unitId').populate('userId').exec()
      let result = unitMembers.map((item, index) => item.userId._id == userId ? item.unitId : '' )
      result = result.filter((item, index) => item != '')

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })
    }

  }

    async findByUnitId(unitId) {

    try {

      const unitMembers = await this.unitMemberModel.find().populate('unitId').populate('userId').exec()
      let result = unitMembers.map((item: any, index) => item.unitId._id == unitId ? item.userId : '' )
      result = result.filter((item, index) => item != '')

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })
      
    }

  }

  async create(body: CreateUnitMemberDto) {

    try {

      const exist = await this.unitMemberModel.findOne({ userId: body.userId, unitId: body.unitId })
      if(exist) {
        throw new BadRequestException({ success: false, error: "User already exists in this unit." })
      }

      const unitMember = await this.unitMemberModel.create(body)

      return { success: true, message: unitMember }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }
  }

}
