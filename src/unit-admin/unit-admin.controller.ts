import { ApiExtraModels, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnitAdminService } from './unit-admin.service';
import { Controller, Get, Param } from '@nestjs/common';
import { resGetAllUnitAdminDto } from './dto/unitAdminResponse.dto';
import { UnitAdmin } from './schema/unit-admin.schema';

@ApiTags('unit-admin')
@ApiExtraModels(UnitAdmin)
@Controller('')
export class UnitAdminController {
  constructor(
    private unitAdminService: UnitAdminService
  ) {}

  // Find All Related Unit and Admin
  @Get('unit-admins')
  @ApiOperation({ summary: 'Getting the Unit & Admin relation table.' })
  @ApiResponse({ status: 200, description: 'Get all unit admins', schema: resGetAllUnitAdminDto })
  async findAll() {
    return this.unitAdminService.findAll()
  }

}
