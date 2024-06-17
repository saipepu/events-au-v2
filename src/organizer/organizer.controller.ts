import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ParticipantService } from 'src/participant/participant.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from 'src/event/dto/create-event.dto';
import { EventService } from 'src/event/event.service';
import { UpdateEventDto } from 'src/event/dto/update-event.dto';
import { UpdateEventStatusDto } from 'src/event/dto/update-event-status.dto';
import { updateEventUnitDto } from 'src/event-unit/dto/update-event-unit.dto';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Organizer } from './schema/organizer.schema';
import { resGetAllOrganizerDto, resGetOrganizerByIdDto } from './dto/organizerResponse.dto';
import { UpdateParticipantStatusManyDto, UpdateParticipantStatusSingleDto } from 'src/participant/dto/update-participant-status.dto';

@ApiTags('organizer')
@ApiExtraModels(Organizer, updateEventUnitDto)
@Controller('')
export class OrganizerController {
  constructor(
    private organizerService: OrganizerService,
    private eventService: EventService
  ) {}

  // Get All Organizers
  @Get('orgs')
  @ApiOperation({ summary: 'Getting All Organizers' })
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

  // Get Organizer by ID
  @Get('org/:id')
  @ApiOperation({ summary: 'Getting Organizer by ID' })
  @ApiResponse({ status: 200, description: 'Get organizer by ID', schema: resGetOrganizerByIdDto })
  async findById(
    @Param('id')
    id: string
  ) {
    return this.organizerService.findById(id)
  }

  // Update Event Basic Info
  @Put('org/event/:eventId/basic-info')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update Event Basic Info' })
  @ApiBearerAuth('bearer-token')
  async update(
    @Param('eventId')
    eventId: string,
    @Body()
    body: UpdateEventDto,
  ) {
    return this.eventService.update(eventId, body)
  }

  // Update Event Status
  @Put('org/event/:eventId/status')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update Event Status' })
  @ApiBearerAuth('bearer-token')
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

  // Manage Many Participant
  @Put('org/event/:eventId/participants')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update Participant Status (Many)' })
  @ApiBearerAuth('bearer-token')
  async manageParticipant(
    @Param('eventId')
    eventId: string,
    @Body()
    body: UpdateParticipantStatusManyDto
  ) {
    return this.organizerService.updateParticipantStatus(body, true)
  }

  // TODO
  // Manage Signle Participant
  @Put('org/event/:eventId/participant')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update Participant Status (Single)' })
  @ApiBearerAuth('bearer-token')
  async manageSingleParticipant(
    @Param('eventId')
    eventId: string,
    @Body()
    body: UpdateParticipantStatusSingleDto
  ) {
    return this.organizerService.updateParticipantStatus(body, false)
  }


  // Update Event Unit
  @Put('org/event/:eventId/unit')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update Event Unit' })
  @ApiBearerAuth('bearer-token')
  async manageEventUnit(
    @Param('eventId')
    eventId: string,
    @Body()
    body: updateEventUnitDto
  ) {
    return this.organizerService.updateEventUnit(eventId, body)
  }

}
 
