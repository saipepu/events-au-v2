import { NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { Organizer } from "src/organizer/schema/organizer.schema";
import * as jwt from 'jsonwebtoken'
import { OrganizerService } from "src/organizer/organizer.service";

export class isOrganizer implements NestMiddleware {

  constructor(
    @InjectModel(Organizer.name)
    private organizerModel: Model<Organizer>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {

    console.log(req.headers)
    const token = req.headers.authorization?.split(' ')[1]
    const decode: any = jwt.decode(token)
    const eventId = req.params.eventId
    const userId = decode.id
    
    // this approach can lead to performance bottleneck
    // but mongoose.Types.ObjectId is deprecated, and can't find another solution at the moment
    const organizers = await this.organizerModel.find()
    let result = organizers.filter((item: any, index) => item.userId._id == userId && item.eventId._id == eventId )
    
    if(result.length == 0) {

      throw new UnauthorizedException({ success: false, error: "Unauthorized organizer."})
      
    }

    next()
  }
}