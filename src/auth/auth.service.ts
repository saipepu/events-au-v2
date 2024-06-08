import { UnitService } from 'src/unit/unit.service';
import { AdminService } from './../admin/admin.service';
import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { RestrictedToken } from './schema/restrictedToken.schema';
import { SignOutDto } from './dto/signOut.dto';
import { Admin } from 'src/admin/schema/admin.schema';
import { CreateAdminDto } from 'src/admin/dto/create.admin.dto';

export interface SignUpResponse {
  success: boolean;
  message?: { user: User, admin: Admin } | User;
  error?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(RestrictedToken.name)
    private restrictedTokenModel: Model<RestrictedToken>,
    private jwtService: JwtService,
    private adminService: AdminService,
    private unitService: UnitService
  ) {}

  async signUp({ isAdmin, body } : { isAdmin: boolean, body: SignUpDto }): Promise<SignUpResponse> {

    console.log(isAdmin, body)

    const user = await this.userModel.findOne({ fId: body.fId })
    if(user) {

      throw new BadRequestException({ success: false, error: 'User already exist. Please login.'})

    }

    if(isAdmin && body?.unitId == undefined) {

      throw new BadRequestException({ success: false, error: 'Admin must belong to one unit.'})
      
    } else if( body?.unitId != undefined) {
      
      const unit = await this.unitService.findById(body?.unitId)
      console.log(unit)
      if(!unit) {
        throw new BadGatewayException({ success: false, error: "Unit id doesn't exist."})
      }

    }

    try {

      const res = await this.userModel.create(body)
      console.log(res, 'user created')

      if(isAdmin) {

        let adminDto: CreateAdminDto = {
          userId: res._id.toString(),
          unitId: body?.unitId
        }
        const admin = await this.adminService.create(adminDto)

        return { success: true, message: { user: res, admin: admin.message }}

      }

      return { success: true, message: res }

    } catch(err) {

      return { success: false, error: err.errmsg ? err.errmsg : err.message }

    }

  }

  async signIn(body: SignInDto) {

    const user = await this.userModel.findOne({ fId: body.fId })
    if(!user) {
      throw new NotFoundException({ success: false, error: 'User not found.Please signup first.'})
    }

    try {
      
      const token = this.jwtService.sign({ id: user._id })
      return { success: true, message: { token, user } }
    } catch(err) {
      return { success: false, error: err.errmsg ? err.errmsg : err.message }
    }

  }

  async signOut(req) {

    const token: SignOutDto = { token: req.headers.authorization.split(' ')[1] }

    try {
      const res = this.restrictedTokenModel.create(token)
      return { success: true, message: "Signout complete."}
    } catch(err) {
      return { success: false, error: err.errmsg ? err.errmsg : err.message }
    }
  }

  async protected() {
    return "Authenticated!"
  }
}
