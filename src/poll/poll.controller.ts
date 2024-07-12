import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { resGetAllPollDto } from './dto/pollResponse.dto';
import { Query as QueryExpress } from 'express-serve-static-core'
import { Poll } from './schema/poll.schema';

@ApiTags('poll')
@ApiExtraModels(Poll)
@Controller('')
export class PollController {
  constructor(private pollService: PollService) {}

  @Get('poll')
  @ApiOperation({ summary: 'Find all polls' })
  @ApiResponse({ status: 200, description: 'List of polls (can be empty)', schema: resGetAllPollDto })
  async findAll(
    @Query()
    query: QueryExpress
  ) {
    return this.pollService.findAll(query);
  }

  @Get('poll/event/:id')
  @ApiOperation({ summary: 'Find poll by Event ID' })
  async findByEventId(
    @Param('id')
    eventId: string
  ) {
    return this.pollService.findByEventId(eventId);
  }
}
