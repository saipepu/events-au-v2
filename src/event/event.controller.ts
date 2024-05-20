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
import { resGetAllDto, resGetByIdDto, resGetByIdDtoNotFound } from './dto/eventResponse.dto';

@ApiTags('event')
@ApiExtraModels(Event, CreateEventDto, UpdateEventDto, UpdateEventStatusDto)
@Controller('')
export class EventController {
  constructor(
    private eventService: EventService,
    private eventUnitService: EventUnitService
  ) {}

  @Get('events')
  @ApiResponse({ status: 200, description: 'List of events (can be empty)', schema: resGetAllDto })
  async findAll(
    @Query()
    query: QueryExpress
  ) {
    return this.eventService.findAll(query)
  }

  @Get('event/:id')
  @ApiResponse({ status: 200, description: 'Event found', schema: resGetByIdDto })
  async findById(
    @Param('id')
    id: string
  ) {
    return this.eventService.findById(id)
  }

  @Get('events/unit/:id')
  @ApiOperation({ summary: 'Find all events for a unit' })
  @ApiResponse({ status: 200, description: 'Event found', schema: resGetByIdDto })
  // @ApiResponse({ status: 404, description: 'No Event found for this Unit', schema: resGetByIdDtoNotFound })
  async findByUnitId(
    @Param('id')
    unitId: string
  ) {
    return this.eventUnitService.findByUnitId(unitId)
  }

}
