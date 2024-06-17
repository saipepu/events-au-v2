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

  async findAll(query?): Promise<{ success: boolean, message: Admin[] }> {
    
    const admins = await this.adminModel.find(query).populate(['unitId', 'userId']).exec();

    return { success: true, message: admins }

  }

  async findById(id: string): Promise<{ success: boolean, message: Admin }> { 
      
      if(!mongoose.isValidObjectId(id)) {
        throw new BadRequestException({ success: false, error: "Admin Id is invalid."})
      }
  
      const admin = await this.adminModel.findById(id)
  
      if(!admin) {
        throw new BadRequestException({ success: false, error: "Admin not found."})
      }

      return { success: true, message: admin }
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
