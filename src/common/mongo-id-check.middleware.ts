import { NestMiddleware, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export function MongoIdCheckMiddleware(id: string) {

  return async(req: Request, res: Response, next: NextFunction) => {

    if(!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException("Book Id is invalid.")
    }
    const event = await this.eventModel.findById(id);
    if(!event) {
      throw new NotFoundException({ success: false, error: "Event not found."})
    }

    next()
  }

}