import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UnitAdmin } from './schema/unit-admin.schema';

@Injectable()
export class UnitAdminService {
  constructor(
    @InjectModel(UnitAdmin.name)
    private unitAdminModel: mongoose.Model<UnitAdmin>
  ) {}

  async findAll() {
    
    const unitAdmins = await this.unitAdminModel.find().populate('adminId').populate('unitId').exec()

    return { success: true, message: unitAdmins }
  }

  async findByAdminId(adminId) {

    console.log(adminId)
    try {

      const unitAdmins = await this.unitAdminModel.find().populate('adminId').populate('unitId').exec()
      let result = unitAdmins.map((item: any, index) => item.adminId._id == adminId ? item.unitId : '' )
      result = result.filter((item, index) => item != '')

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }

  }

  async findByUnitId(unitId) {

    console.log(unitId)
    try {

      const unitAdmins = await this.unitAdminModel.find().populate('adminId').populate('unitId').exec()
      let result = unitAdmins.map((item: any, index) => item.unitId._id == unitId ? item.adminId : '' )
      result = result.filter((item, index) => item != '')

      return { success: true, message: result }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }

  }

  async create(body) {

    try {

      console.log(body)
      const unitAdmin = await this.unitAdminModel.create(body)
  
      return { success: true, message: unitAdmin }

    } catch(err) {

      throw new BadRequestException({ success: false, error: err })

    }

  }

}
