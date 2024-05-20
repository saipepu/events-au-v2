import { Controller, Get, Param } from '@nestjs/common';
import { UnitMemberService } from './unit-member.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UnitMember } from './schema/unit-member.schema';

@ApiTags('unit-member')
@ApiExtraModels(UnitMember)
@Controller('')
export class UnitMemberController {
  constructor(
    private unitMemberService: UnitMemberService
  ) {}

}
