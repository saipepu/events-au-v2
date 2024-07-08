import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePollResultDto } from './dto/create-poll-result.dto';
import { User } from 'src/user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PollResult } from './schema/poll-result.schema';
import mongoose from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PollResultService {

  constructor(
    @InjectModel(PollResult.name)
    private pollResultModel: mongoose.Model<PollResult>,
    @Inject(forwardRef(() => UserService)) //<---
    private userService: UserService,
  ) {}

  async create(createPollResultDto: CreatePollResultDto, user: User) {
    try {
      const u = await this.userService.findById(user._id);
      console.log(createPollResultDto, u);

      let pollResult = await this.pollResultModel.create(createPollResultDto);
      return { success: true, message: pollResult };
    } catch (error) {
      throw new BadRequestException({ success: false, error: error });
    }
  }

  findAll() {
    return `This action returns all pollResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pollResult`;
  }
}
