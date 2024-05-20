import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventUnitSchema } from './schema/event-unit.schema';
import { EventUnitController } from './event-unit.controller';
import { EventUnitService } from './event-unit.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EventUnit', schema: EventUnitSchema }
    ])
  ],
  controllers: [EventUnitController],
  providers: [EventUnitService],
  exports: [EventUnitService]
})
export class EventUnitModule {}
