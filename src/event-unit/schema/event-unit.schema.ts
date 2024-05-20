import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
import { Event } from "src/event/schema/event.schema";
import { Unit } from "src/unit/schema/unit.schema";

@Schema({
  timestamps: true
})
export class EventUnit extends Document {
  @ApiProperty({ example: '<eventId>', description: 'Event ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  eventId: Event
  
  @ApiProperty({ example: '<unitId>', description: 'Unit ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unitId: Unit
}

export const EventUnitSchema = SchemaFactory.createForClass(EventUnit)