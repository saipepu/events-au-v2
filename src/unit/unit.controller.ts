import { UnitMemberService } from './../unit-member/unit-member.service';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UnitService } from './unit.service';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { EventUnitService } from 'src/event-unit/event-unit.service';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Unit } from './schema/unit.schema';
import { resCreateUnitSuccessDto, resGetAllDto } from './dto/unitResponse.dto';

@ApiTags('unit')
@ApiExtraModels(Unit)
@Controller('')
export class UnitController {
  constructor(
    private unitService: UnitService,
    private unitMemberService: UnitMemberService,
    private eventUnitService: EventUnitService
  ) {}

  @Get('units')
  @ApiResponse({ status: 200, description: 'List of units (can be empty)', schema: resGetAllDto })
  async findAll(
    @Query()
    query: ExpressQuery 
  ) {
    return this.unitService.findAll(query)
  }

  @Get('unit/:id')
  @ApiResponse({ status: 200, description: 'Unit found', schema: resGetAllDto })
  async findById(
    @Param('id')
    id: string
  ) {
    return this.unitService.findById(id)
  }

  @Get('units/user/:id')
  @ApiOperation({ summary: 'Find all units for a user' })
  @ApiResponse({ status: 200, description: 'Unit found', schema: resGetAllDto })
  async findByUserId(
    @Param('id')
    userId: string
  ) {
    return this.unitMemberService.findByUserId(userId)
  }
  
  @Get('units/event/:id')
  @ApiOperation({ summary: 'Find all units for an event' })
  @ApiResponse({ status: 200, description: 'Unit found', schema: resGetAllDto })
  async findByEventId(
    @Param('id')
    eventId: string
  ) {
    return this.eventUnitService.findByEventId(eventId)
  }

  @Post('unit')
  @ApiResponse({ status: 200, description: 'Unit created', schema: resCreateUnitSuccessDto })
  @UseGuards(AuthGuard())
  async create(
    @Body()
    body
  ) {
    return this.unitService.create(body)
  }

}
