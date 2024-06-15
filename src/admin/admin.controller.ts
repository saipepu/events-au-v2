import { EventService } from 'src/event/event.service';
import { AdminService } from './admin.service';
import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UpdateEventStatusDto } from 'src/event/dto/update-event-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Admin } from './schema/admin.schema';
import { User } from 'src/user/schema/user.schema';
import { get } from 'http';
import { CreateAdminDto } from './dto/create.admin.dto';
import { resGetAdminById, resGetAllAdmin, resUpdateEventStatus } from './dto/adminResponse.dto';
import { resGetAllUnitAdminDto } from 'src/unit-admin/dto/unitAdminResponse.dto';
import { UnitAdminService } from 'src/unit-admin/unit-admin.service';

@ApiTags('admin')
@ApiExtraModels(Admin, User)
@Controller('')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private eventService: EventService,
    private unitAdminService: UnitAdminService
  ) {}

  // Get All Admins
  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({
    status: 200,
    description: 'List of all admins.',
    schema: resGetAllAdmin
  })
  async findAll(): Promise<{ success: boolean, message: Admin[] }> {
    return this.adminService.findAll()
  }

  // Get Admin by ID
  @Get('admin/:id')
  @ApiOperation({ summary: 'Get admin by Id' })
  @ApiResponse({
    status: 200,
    description: 'Admin by Id.',
    schema: resGetAdminById
  })
  async findById(
    @Param('id')
    id: string
  ) : Promise<{success: boolean, message: Admin}> {
    return this.adminService.findById(id)
  }

  // Find Admins by Unit ID
  @Get('admins/unit/:id')
  @ApiOperation({ summary: 'Getting Admins by unit ID.' })
  @ApiResponse({ status: 200, description: 'Get all admins by unit ID', schema: resGetAllUnitAdminDto })
  @ApiParam({ name: 'id', type: String, description: 'Unit ID' })
  async findByUnitId(
    @Param('id')
    unitId: string
  ) {
    return this.unitAdminService.findByUnitId(unitId)
  }

  // Update Event Status
  @Put('admin/event/:id/status')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiBody({ type: UpdateEventStatusDto })
  @ApiOperation({ summary: 'Approve or reject an event.' })
  @ApiResponse({
    status: 200,
    description: 'Event status updated successfully.',
    schema: resUpdateEventStatus
  })
  async manageEvent(
    @Param('id')
    eventId: string,
    @Body()
    body: UpdateEventStatusDto,
    @Req()
    req,
    @Headers()
    headers
  ) {
    
    let validStatus = ["approved", "rejected"]
    if(validStatus.includes(body.status)) {
      return this.eventService.update(eventId, body)
    } else {
      throw new BadRequestException({ success: false, message: "Invalid action."})
    }
  }

}
