import { NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { Organizer } from "src/organizer/schema/organizer.schema";
import * as jwt from 'jsonwebtoken'
import { OrganizerService } from "src/organizer/organizer.service";
import { Admin } from "src/admin/schema/admin.schema";
import { EventUnit } from "src/event-unit/schema/event-unit.schema";
import { UnitAdmin } from "src/unit-admin/schema/unit-admin.schema";

export class isAdmin implements NestMiddleware {

  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    @InjectModel(EventUnit.name)
    private eventUnitModel: Model<EventUnit>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {

    const token = req.headers.authorization.split(' ')[1]
    const decode: any = jwt.decode(token)
    const eventId = req.params.eventId
    const userId = decode.id

    
    const admin: Admin = await this.adminModel.findOne({ _id: req.body.adminId.toString() })
    
    console.log(userId, admin)
    if(userId != admin.userId.toString()) {
      throw new UnauthorizedException({ success: false, error: "Unauthorized admin. This admin does not have access to this event or unit."})
    }
    

    // FIND THE UNIT OF THE EVENT
    // ---------------------------this approach can lead to performance bottleneck
    // ---------------------------but mongoose.Types.ObjectId is deprecated, and can't find another solution at the moment
    const eventUnits = await this.eventUnitModel.find()
    let eUnits: any = eventUnits.filter((item: any, index) => item.eventId.toString() == eventId )
    // ---------------------------eUnit = []

    let result = eUnits.filter((item: EventUnit, index) => item.unitId.toString() == admin.unitId.toString())

    // const unitAdmins = await this.unitAdminModel.find()
    // let result = unitAdmins.filter((item: any, index) => item.adminId.toString() == admin._id.toString() && item.unitId.toString() == eUnitId.toString())

    
    if(result.length == 0) {

      throw new UnauthorizedException({ success: false, error: "Unauthorized admin. This admin does not have access to this event or unit."})
      
    }

    next()
  }
}