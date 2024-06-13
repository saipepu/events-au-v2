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
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Get('users')
  @ApiResponse({ status: 200, description: 'Users found (can be empty)', schema: resGetAllDto })
  async findAll(
    @Query()
    query: QueryExpress
  ) {
    return this.userService.findAll(query)
  }
  
  @Get('user/:id')
  @ApiResponse({ status: 200, description: 'User found', schema: resGetByIdDto })
  async findById(
    @Param('id')
    id: string
  ) {
    return this.userService.findById(id)
  }

  @Put('user/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiResponse({ status: 200, description: 'User updated', schema: resGetByIdDto })
  async update(
    @Param('id')
    id: string,
    @Body()
    body: UpdateUserDto
  ) {
    return this.userService.update(id, body)
  }
  
  @Get('users/unit/:id')
  @ApiResponse({ status: 200, description: 'Users found (can be empty)', schema: resGetAllDto })
  async findByUnitId(
    @Param('id')
    unitId: string
  ) {
    return this.unitMemberService.findByUnitId(unitId)
  }

  @Post('user/create/event') // @Post('/event')
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

  // need to change to user/join/event/:id
  @Post('user/join/event/:id')
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
