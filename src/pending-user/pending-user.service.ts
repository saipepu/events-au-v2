import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PendingUser } from "./schema/entity";

@Injectable()
export class PendingUserService {
  constructor(
    @InjectModel('PendingUser') private pendingUserModel: Model<PendingUser>
  ) {}

  async create({ email }: { email: string }) {
    const createdPendingUser = await this.pendingUserModel.create({ email });
    return createdPendingUser;
  }

  async findAll() {
    return await this.pendingUserModel.find().exec();
  }

  async findOne(query: any) {
    return await this.pendingUserModel.findOne(query).exec();
  }

  async updateVerificationStatus({ email, status }: { email: string; status: boolean }) {
    return await this.pendingUserModel.updateOne({ email }, { isVerified: status }).exec();
  }

  async deleteAll() {
    return await this.pendingUserModel.deleteMany({}).exec();
  }

  async deleteOne(id: string) {
    return await this.pendingUserModel.deleteOne({ _id: id }).exec();
  }

  async deleteByEmail(email: string) {
    return await this.pendingUserModel.deleteOne({ email }).exec();
  }

}