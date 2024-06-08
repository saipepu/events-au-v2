import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ParticipantService } from 'src/participant/participant.service';
import { UpdateParticipantStatusDto } from 'src/participant/dto/update-status-participant.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from 'src/event/dto/create-event.dto';
import { EventService } from 'src/event/event.service';
import { UpdateEventDto } from 'src/event/dto/update-event.dto';
import { UpdateEventStatusDto } from 'src/event/dto/update-event-status.dto';
import { updateEventUnitDto } from 'src/event-unit/dto/update-event-unit.dto';
import { ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Organizer } from './schema/organizer.schema';
import { resGetAllOrganizerDto, resGetOrganizerByIdDto } from './dto/organizerResponse.dto';

@ApiTags('organizer')
@ApiExtraModels(Organizer, UpdateParticipantStatusDto)
@Controller('')
export class OrganizerController {
  constructor(
    private organizerService: OrganizerService,
    private eventService: EventService
  ) {}

  @Get('orgs')
  @ApiResponse({
    status: 200,
    description: 'Get all organizers',
    schema: resGetAllOrganizerDto
  })
  async findAll(
    @Query()
    query: ExpressQuery
  ) {
    return this.organizerService.findAll(query)
  }

  @Get('org/:id')
  @ApiResponse({ status: 200, description: 'Get organizer by ID', schema: resGetOrganizerByIdDto })
  async findById(
    @Param('id')
    id: string
  ) {
    return this.organizerService.findById(id)
  }

  @Put('org/event/:eventId/basic-info')
  @UseGuards(AuthGuard())
  async update(
    @Param('eventId')
    eventId: string,
    @Body()
    body: UpdateEventDto,
  ) {
    return this.eventService.update(eventId, body)
  }

  @Put('org/event/:eventId/status')
  @UseGuards(AuthGuard())
  async updateStatus(
    @Param('eventId')
    eventId: string,
    @Body()
    body: UpdateEventStatusDto,
  ) {
    let validStatus = ["suspended","cancelled","completed"]
    if(validStatus.includes(body.status)) {
      return this.eventService.update(eventId, body)
    } else {
      throw new BadRequestException({ success: false, message: "Invalid action."})
    }
  }

  @Put('org/event/:eventId/participants')
  @UseGuards(AuthGuard())
  async manageParticipant(
    @Param('eventId')
    eventId: string,
    @Body()
    body: UpdateParticipantStatusDto
  ) {
    return this.organizerService.manageParticipant(body)
  }

  @Put('org/event/:eventId/unit')
  @UseGuards(AuthGuard())
  async manageEventUnit(
    @Param('eventId')
    eventId: string,
    @Body()
    body: updateEventUnitDto
  ) {
    return this.organizerService.manageEventUnit(eventId, body)
  }

}
 
