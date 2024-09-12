import { resCreateEventSuccessDto, resGetAllDto, resGetByIdDto, resJoinEventDto, resJoinUnitDto } from './dto/userResponse.dto';
import { UnitMemberService } from './../unit-member/unit-member.service';
import { ParticipantService } from './../participant/participant.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Query as QueryExpress } from 'express-serve-static-core'
import { User } from './schema/user.schema';
import { CreateParticipantDto } from 'src/participant/dto/create-participant.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from 'src/event/dto/create-event.dto';
import { EventService } from 'src/event/event.service';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { PollService } from 'src/poll/poll.service';
import { CreatePollDto } from 'src/poll/dto/create-poll.dto';
import { create } from 'domain';
import { DeletePollDto } from 'src/poll/dto/delete-poll.dts';
import { CreatePollResultDto } from 'src/poll-result/dto/create-poll-result.dto';
import { PollResultService } from 'src/poll-result/poll-result.service';

@ApiTags('user')
@ApiExtraModels(User, CreateEventDto, CreateParticipantDto, UpdateUserDto)
@Controller('')
export class UserController {
  constructor(
    private userService: UserService,
    private eventService: EventService,
    private unitMemberService: UnitMemberService,
    private pollService: PollService,
    private pollResultService: PollResultService
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
  
  // Get All Users in a Unit
  @Get('users/unit/:id')
  @ApiOperation({ summary: 'Find all users in a unit' })
  @ApiResponse({ status: 200, description: 'Users found (can be empty)', schema: resGetAllDto })
  async findByUnitId(
    @Param('id')
    unitId: string
  ) {
    return this.unitMemberService.findByUnitId(unitId)
  }

  @Put('user/:id')
  @ApiOperation({ summary: 'Update user' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated', schema: resGetByIdDto })
  async update(
    @Param('id')
    id: string,
    @Body()
    body: UpdateUserDto
  ) {
    return this.userService.update(id, body)
  }

  // Create Event
  @Post('user/create/event') // @Post('/event')
  @ApiOperation({ summary: 'Create new event (organizer & admin role are branches of user, so call this api to create new event).' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created. After passing the validation middleware, we can create the event with the Id that we get from the request token. That is why there is no need to pass user id for who create this event. The id from the requested token will be used.', schema: resCreateEventSuccessDto })
  async createEvent(
    @Body()
    body: CreateEventDto,
    @Req() req
  ) {
    // after passing the validation middleware, we can create the event with the Id that we get from the request token
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

  // Create Poll
  @Post('user/create/poll')
  @ApiOperation({ summary: 'Create new poll' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiBody({ type: CreatePollDto })
  @ApiResponse({ status: 201, description: 'Poll created'})
  async createPoll(
    @Body() createPollDto: CreatePollDto,
    @Req() req
  ) {
    return this.pollService.create(createPollDto, req.user)
  }

  // Delete Poll
  @Delete('user/delete/poll')
  @ApiOperation({ summary: 'Delete a poll' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiBody({ type: DeletePollDto })
  @ApiResponse({ status: 200, description: 'Poll deleted successfully' })
  async deletePoll(
    @Body() deletePollDto: DeletePollDto,
    @Req() req
  ) {
    return this.pollService.delete(deletePollDto.pollId, req.user);
  }

  // Create Poll
  @Post('user/poll/result')
  @ApiOperation({ summary: 'Submit poll result' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiBody({ type: CreatePollResultDto })
  @ApiResponse({ status: 201, description: 'Poll Result created'})
  async createPollResult(
    @Body() createPollResultDto: CreatePollResultDto,
    @Req() req
  ) {
    return this.pollResultService.create(createPollResultDto, req.user)
  }

  @Delete('user/:id/soft-delete')
  @ApiOperation({ summary: 'Soft Delete user' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth('bearer-token')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async softDelete(
    @Param('id')
    id: string
  ) {
    return this.userService.softDelete(id);
  }

  @Post('user/:id/recover')
  @ApiOperation({ summary: 'Recover user' })
  @ApiResponse({ status: 200, description: 'User recovered successfully' })
  async recover(
    @Param('id')
    id: string
  ) {
    return this.userService.recover(id);
  }

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
