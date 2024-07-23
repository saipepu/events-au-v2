import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PollResultService } from './poll-result.service';
import { CreatePollResultDto } from './dto/create-poll-result.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('poll-result')
@Controller('poll-result')
export class PollResultController {
  constructor(private readonly pollResultService: PollResultService) {}

  @Get()
  findAll() {
    return this.pollResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollResultService.findOne(id);
  }

}
