import { resCreateEventSuccessDto, resGetAllDto, resGetByIdDto, resJoinEventDto, resJoinUnitDto } from './dto/userResponse.dto';
import { UnitMemberService } from './../unit-member/unit-member.service';
import { ParticipantService } from './../participant/participant.service';
import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Query as QueryExpress } from 'express-serve-static-core'
import { User } from './schema/user.schema';
import { CreateParticipantDto } from 'src/participant/dto/create-participant.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from 'src/event/dto/create-event.dto';
import { EventService } from 'src/event/event.service';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@ApiExtraModels(User, CreateEventDto, CreateParticipantDto, UpdateUserDto)
@Controller('')
export class UserController {
  constructor(
    private userService: UserService,
    private eventService: EventService,
    private unitMemberService: UnitMemberService
  ) {}

  // Get All Users
  @Get('users')
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Users found (can be empty)', schema: resGetAllDto })
  async findAll(
    @Query()
    query: QueryExpress
  ) {
    return this.userService.findAll(query)
  }
  
  // Get User by ID
  @Get('user/:id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiResponse({ status: 200, description: 'User found', schema: resGetByIdDto })
  async findById(
    @Param('id')
    id: string
  ) {
    return this.userService.findById(id)
  }

  // // Create User
  // @Put('user/:id')
  // @ApiOperation({ summary: 'Create new user' })
  // @UseGuards(AuthGuard())
  // @ApiBearerAuth('bearer-token')
  // @ApiResponse({ status: 200, description: 'User updated', schema: resGetByIdDto })
  // async update(
  //   @Param('id')
  //   id: string,
  //   @Body()
  //   body: UpdateUserDto
  // ) {
  //   return this.userService.update(id, body)
  // }
  
  // Get All Users in a Unit
 
  @Get('users/unit/:id')
  @ApiResponse({ status: 200, description: 'Users found (can be empty)', schema: resGetAllDto })
  async findByUnitId(
    @Param('id')
    unitId: string
  ) {
    return this.unitMemberService.findByUnitId(unitId)
  }

  // Create Event
  @Post('user/create/event') // @Post('/event')
  @ApiOperation({ summary: 'Create new event (organizer & admin role are branches of user, so call this api to create new event).' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created', schema: resCreateEventSuccessDto })
  async createEvent(
    @Body()
    body: CreateEventDto,
    @Req() req
  ) {
    return this.eventService.create(body, req.user)
  }

  // Let user join new Event
  @Post('user/join/event/:id')
  @ApiOperation({ summary: 'User Join Event' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiResponse({ status: 200, description: 'User joined event', schema: resJoinEventDto })
  async joinEvent(
    @Param('id')
    eventId: string,
    @Req() req
  ) {
    return this.userService.joinEvent(eventId, req.user)

  }

  // Let user join new Unit
  // @Post('user/join/unit/:id')
  // @UseGuards(AuthGuard())
  // @ApiBearerAuth('bearer-token')
  // @ApiResponse({ status: 200, description: 'User joined unit', schema: resJoinUnitDto })
  // async joinUnit(
  //   @Param('id')
  //   unitId: string,
  //   @Req() req
  // ) {
  //   return this.userService.joinUnit(unitId, req.user)
  // }
}
