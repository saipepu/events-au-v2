import { Module } from '@nestjs/common';
import { UnitAdminController } from './unit-admin.controller';
import { UnitAdminService } from './unit-admin.service';
import { UnitAdmin, UnitAdminSchema } from './schema/unit-admin.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "UnitAdmin", schema: UnitAdminSchema }
    ])
  ],
  controllers: [UnitAdminController],
  providers: [UnitAdminService],
  exports: [UnitAdminService]
})
export class UnitAdminModule {}
