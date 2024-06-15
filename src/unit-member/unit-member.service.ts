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

  // Find By User ID
  async findByUserId(userId: string) {

    try {

      const result = await this.unitMemberModel.find({ userId: userId }).populate('unitId').populate('userId').exec()

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })
    }

  }

  // Find By Unit ID
  async findByUnitId(unitId) {

    try {

      const result = await this.unitMemberModel.find({ unitId: unitId }).populate('unitId').populate('userId').exec()

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })
      
    }

  }

  // Create Unit Member
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
