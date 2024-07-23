import { BadRequestException, forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    const pollResult = await this.pollResultModel.find().populate('userId').exec()

    return { success: true, message: pollResult };
  }

  findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotAcceptableException('Poll Result Id is invalid.');
    }

    const pollResult = this.pollResultModel.findById(id);

    if (!pollResult) {
      throw new NotFoundException('Poll Result not found.');
    }

    return pollResult
  }

  async findByPollId(pollId: string) {
    if (!mongoose.isValidObjectId(pollId)) {
      throw new NotAcceptableException('Poll Id is invalid.');
    }

    const pollResults = await this.pollResultModel.find({ pollId }).populate('userId').exec();

    return { success: true, message: pollResults };
  }

}
