import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventUnitService } from './event-unit.service';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventUnit } from './schema/event-unit.schema';
import { resGetAllEventUnitDto } from './dto/eventUnitResponse.dto';

@ApiTags('event-unit')
@ApiExtraModels(EventUnit)
@Controller('')
export class EventUnitController {
  constructor(
    private eventUnitService: EventUnitService
  ) {}

  @Get('event-units')
  @ApiOperation({ summary: 'Getting the Unit&Event relation table.' })
  @ApiResponse({ status: 200, description: 'Get all event units', schema: resGetAllEventUnitDto })
  async findAll(
    @Query()
    query: ExpressQuery
  ) {
    return this.eventUnitService.findAll(query)
  }

}
