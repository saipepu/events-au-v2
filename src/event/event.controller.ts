import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './schema/event.schema';
import { Query as QueryExpress } from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { EventUnitService } from 'src/event-unit/event-unit.service';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { resGetAllDto, resGetByIdDto, resGetByIdDtoNotFound, resGetByOrganizerIdDto, resGetByUnitIdDto, resGetByUserIdDto } from './dto/eventResponse.dto';
import { ParticipantService } from 'src/participant/participant.service';
import { OrganizerService } from 'src/organizer/organizer.service';

@ApiTags('event')
@ApiExtraModels(Event, CreateEventDto, UpdateEventDto, UpdateEventStatusDto)
@Controller('')
export class EventController {
  constructor(
    private eventService: EventService,
    private eventUnitService: EventUnitService,
    private participantService: ParticipantService,
    private organizerService: OrganizerService
  ) {}


  // Find All Events
  @Get('events')
  @ApiOperation({ summary: 'Find all events' })
  @ApiResponse({ status: 200, description: 'List of events (can be empty)', schema: resGetAllDto })
  async findAll(
    @Query()
    query: QueryExpress
  ) {
    return this.eventService.findAll(query)
  }

  // Find Event by Id
  @Get('event/:id')
  @ApiOperation({ summary: 'Find event by Id' })
  @ApiResponse({ status: 200, description: 'Event found', schema: resGetByIdDto })
  async findById(
    @Param('id')
    id: string
  ) {
    return this.eventService.findById(id)
  }

  // Find Event By Unit Id
  @Get('events/unit/:id')
  @ApiOperation({ summary: 'Find all events for a unit' })
  @ApiResponse({ status: 200, description: 'Event found', schema: resGetByUnitIdDto })
  // @ApiResponse({ status: 404, description: 'No Event found for this Unit', schema: resGetByIdDtoNotFound })
  async findByUnitId(
    @Param('id')
    unitId: string
  ) {
    return this.eventUnitService.findByUnitId(unitId)
  }

  // Find Event by Participant Id
  @Get('events/participant/:id')
  @ApiOperation({ summary: 'Find all events for a participant by userId', description: 'Have to pass userId of the participant'})
  @ApiResponse({ status: 200, description: 'Event found', schema: resGetByUserIdDto })
  async findByUserId(
    @Param('id')
    userId: string
  ) {
    return this.participantService.findByUserId(userId)
  }

  // Find Eventy by Organizer Id
  @Get('events/organizer/:id')
  @ApiOperation({ summary: 'Find all events for an organizer by userId', description: 'Have to pass userId of the organizer'})
  @ApiResponse({ status: 200, description: 'Event found', schema: resGetByOrganizerIdDto })
  async findByOrganizerId(
    @Param('id')
    organizerId: string
  ) {
    return this.organizerService.findByUserId(organizerId)
  }

}
