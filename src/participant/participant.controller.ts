import { Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Participant } from './schema/participant.schema';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { resGetAllParticipantDto, resGetParticipantByIdDto } from './dto/participant-response.dto';

@ApiTags('participant')
@ApiExtraModels(Participant, CreateParticipantDto)
@Controller('')
export class ParticipantController {
  constructor(
    private participantService: ParticipantService
  ) {}
  
  // Find All Participants
  @Get('participants')
  @ApiOperation({ summary: 'Getting All Participants' })
  @ApiResponse({ status: 200, description: 'Get all participants', schema: resGetAllParticipantDto })
  async findAll(
    @Query()
    query: ExpressQuery
  ) {
    return this.participantService.findAll(query)
  }

  // Find Participant by Event Id
  @Get('participants/event/:id')
  @ApiOperation({ summary: 'Getting Participants by Event ID' })
  async findByEventId(
    @Param('id')
    eventId: string
  ) {
    return this.participantService.findByEventId(eventId)
  }

  // Participant Leave an Event
  @Put('participant/leave/event/:id')
  @ApiOperation({ summary: 'Leave Event' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  async leaveEvent(
    @Param('id')
    eventId: string,
    @Req() req
  ) {
    return this.participantService.leaveEvent(eventId, req.user)
  }

}
