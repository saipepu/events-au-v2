import { EventService } from 'src/event/event.service';
import { AdminService } from './admin.service';
import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UpdateEventStatusDto } from 'src/event/dto/update-event-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Admin } from './schema/admin.schema';
import { User } from 'src/user/schema/user.schema';
import { get } from 'http';
import { CreateAdminDto } from './dto/create.admin.dto';

@ApiTags('admin')
@ApiExtraModels(Admin, User)
@Controller('')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private eventService: EventService,
  ) {}

  @Get('admins')
  @ApiResponse({
    status: 200,
    description: 'List of all admins.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: {
          type: 'array',
          items: {
            $ref: getSchemaPath(Admin)
          }
        }
      }
    }
  })
  async findAll(): Promise<{ success: boolean, message: Admin[] }> {
    return this.adminService.findAll()
  }

  @Put('admin/event/:id/status')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiBody({ type: UpdateEventStatusDto })
  @ApiOperation({ summary: 'Approve or reject an event.' })
  @ApiResponse({
    status: 200,
    description: 'Event status updated successfully.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
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
