import { Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Participant } from './schema/participant.schema';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantStatusDto } from './dto/update-status-participant.dto';

@ApiTags('participant')
@ApiExtraModels(Participant, CreateParticipantDto, UpdateParticipantStatusDto)
@Controller('')
export class ParticipantController {
  constructor(
    private participantService: ParticipantService
  ) {}
  
  @Get('participants')
  async findAll(
    @Query()
    query: ExpressQuery
  ) {
    return this.participantService.findAll(query)
  }

  @Get('participant/:id')
  async findById(
    @Param('id')
    id: string
  ) {
    return this.participantService.findById(id)
  }

  @Put('participant/leave/event/:id')
  @UseGuards(AuthGuard())
  async leaveEvent(
    @Param('id')
    eventId: string,
    @Req() req
  ) {
    return this.participantService.leaveEvent(eventId, req.user)
  }

}
