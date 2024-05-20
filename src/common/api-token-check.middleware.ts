import { BadRequestException, HttpException, NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { RestrictedToken } from "src/auth/schema/restrictedToken.schema";

export class ApiTokenCheckMiddleware implements NestMiddleware {

  constructor(
    @InjectModel(RestrictedToken.name)
    private restrictedTokenModel: Model<RestrictedToken>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {

    if(!req.headers.authorization) {
      throw new BadRequestException({ success: false, error: "Authorization token is undefined."})
    }

    const token = req.headers.authorization.split(' ')[1]

    const expired = await this.restrictedTokenModel.findOne({ token: token })

    if(expired) {
      console.log('expired')
      throw new BadRequestException({ success: false, error: "Invalid Token"})
    } else {
      console.log('active')
    }

    next()
  }
}