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

  @Get('unit-admins')
  @ApiOperation({ summary: 'Getting the Unit&Admin relation table.' })
  @ApiResponse({ status: 200, description: 'Get all unit admins', schema: resGetAllUnitAdminDto })
  async findAll() {
    return this.unitAdminService.findAll()
  }

  @Get('unit-admins/unit/:id')
  @ApiOperation({ summary: 'Getting Admins by unit ID.' })
  @ApiResponse({ status: 200, description: 'Get all admins by unit ID', schema: resGetAllUnitAdminDto })
  @ApiParam({ name: 'id', type: String, description: 'Unit ID' })
  async findByUnitId(
    @Param('id')
    unitId: string
  ) {
    return this.unitAdminService.findByUnitId(unitId)
  }

  @Get('unit-admins/admin/:id')
  @ApiOperation({ summary: 'Getting Units by admin ID.' })
  @ApiResponse({ status: 200, description: 'Get all units by admin ID', schema: resGetAllUnitAdminDto })
  @ApiParam({ name: 'id', type: String, description: 'Admin ID' })
  async findByAdminId(
    @Param('id')
    adminId: string
  ) {
    return this.unitAdminService.findByAdminId(adminId)
  }

}
