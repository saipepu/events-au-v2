import { UserService } from './../user/user.service';
import { UnitAdminService } from './../unit-admin/unit-admin.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import mongoose from 'mongoose';
import { CreateAdminDto } from './dto/create.admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: mongoose.Model<Admin>,
    private unitAdminService: UnitAdminService,
    private userService: UserService,
  ) {}

  async findAll(): Promise<{ success: boolean, message: Admin[] }> {
    
    const admins = await this.adminModel.find()

    return { success: true, message: admins }

  }

  async create(body: CreateAdminDto) {

    try {

      const admin = await this.adminModel.create(body)

      let unitAdminDto = {
        adminId: admin._id.toString(),
        unitId: body.unitId
      }
      console.log(admin, 'admin')
      console.log(unitAdminDto)

      const unitAdmin = await this.unitAdminService.create(unitAdminDto)

      return { success: true, message: admin }

    } catch(err) {

      console.log(err)
      throw new BadRequestException({ success: false, error: err })

    }
  }
}
