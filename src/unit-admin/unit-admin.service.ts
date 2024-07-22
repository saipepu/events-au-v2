import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { model } from 'mongoose';
import { UnitAdmin } from './schema/unit-admin.schema';

@Injectable()
export class UnitAdminService {
  constructor(
    @InjectModel(UnitAdmin.name)
    private unitAdminModel: mongoose.Model<UnitAdmin>,
  ) {}

  async findAll() {
    const unitAdmins = await this.unitAdminModel
      .find()
      .populate('adminId')
      .populate('unitId')
      .exec();

    return { success: true, message: unitAdmins };
  }

  async findByAdminId(adminId) {
    try {
      const result = await this.unitAdminModel
        .find({ adminId: adminId })
        .populate('adminId')
        .populate('unitId')
        .exec();

      return { success: true, message: result };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  async findByUnitId(unitId: string) {
    try {
      const result = await this.unitAdminModel
        .find({ unitId: unitId })
        .populate({
          path: 'adminId',
          populate: {
            path: 'userId',
            model: 'User',
          },
        })
        .populate('unitId')
        .exec();

      return { success: true, message: result };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }

  async create(body) {
    try {
      console.log(body);
      const unitAdmin = await this.unitAdminModel.create(body);

      return { success: true, message: unitAdmin };
    } catch (err) {
      throw new BadRequestException({ success: false, error: err });
    }
  }
}
