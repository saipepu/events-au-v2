import { UnitMemberController } from './unit-member.controller';
import { Module } from '@nestjs/common';
import { UnitMemberSchema } from './schema/unit-member.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Unit } from 'src/unit/schema/unit.schema';
import { UnitMemberService } from './unit-member.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UnitMember', schema: UnitMemberSchema },
      { name: 'Unit', schema: Unit}
    ])
  ],
  controllers: [UnitMemberController],
  providers: [UnitMemberService],
  exports: [UnitMemberService]
})
export class UnitMemberModule {}
