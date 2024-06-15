import { UnitMemberService } from './../unit-member/unit-member.service';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UnitService } from './unit.service';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { EventUnitService } from 'src/event-unit/event-unit.service';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Unit } from './schema/unit.schema';
import { resCreateUnitSuccessDto, resGetAllDto, resGetUnitsByAdminIdDto } from './dto/unitResponse.dto';
import { CreateUnitDto } from './dto/create-unit.do';
import { resGetAllUnitAdminDto } from 'src/unit-admin/dto/unitAdminResponse.dto';
import { UnitAdminService } from 'src/unit-admin/unit-admin.service';

@ApiTags('unit')
@ApiExtraModels(Unit)
@Controller('')
export class UnitController {
  constructor(
    private unitService: UnitService,
    private unitMemberService: UnitMemberService,
    private eventUnitService: EventUnitService,
    private unitAdminService: UnitAdminService
  ) {}

  @Get('units')
  @ApiOperation({ summary: 'Find All Units' })
  @ApiResponse({ status: 200, description: 'List of units (can be empty)', schema: resGetAllDto })
  async findAll(
    @Query()
    query: ExpressQuery 
  ) {
    return this.unitService.findAll(query)
  }

  @Get('unit/:id')
  @ApiOperation({ summary: 'Find Unit by ID' })
  @ApiResponse({ status: 200, description: 'Unit found', schema: resGetAllDto })
  async findById(
    @Param('id')
    id: string
  ) {
    return this.unitService.findById(id)
  }

  // Find Units by User ID
  @Get('units/user/:id')
  @ApiOperation({ summary: 'Find all units for a user' })
  @ApiResponse({ status: 200, description: 'Unit found', schema: resGetAllDto })
  async findByUserId(
    @Param('id')
    userId: string
  ) {
    return this.unitMemberService.findByUserId(userId)
  }
  
  // Find Units by Event ID
  @Get('units/event/:id')
  @ApiOperation({ summary: 'Find all units for an event' })
  @ApiResponse({ status: 200, description: 'Unit found', schema: resGetAllDto })
  async findByEventId(
    @Param('id')
    eventId: string
  ) {
    return this.eventUnitService.findByEventId(eventId)
  }

  // Find Units by Admin ID
  @Get('units/admin/:id')
  @ApiOperation({ summary: 'Getting Units by admin ID.' })
  @ApiResponse({ status: 200, description: 'Get all units by admin ID', schema: resGetUnitsByAdminIdDto })
  @ApiParam({ name: 'id', type: String, description: 'Admin ID' })
  async findByAdminId(
    @Param('id')
    adminId: string
  ) {
    return this.unitAdminService.findByAdminId(adminId)
  }

  @Post('unit')
  @ApiOperation({ summary: 'Create a new unit (no user flow for this yet)' })
  @ApiBody({ type: CreateUnitDto })
  @ApiResponse({ status: 200, description: 'Unit created', schema: resCreateUnitSuccessDto })
  async create(
    @Body()
    body: CreateUnitDto
  ) {
    return this.unitService.create(body)
  }

}
