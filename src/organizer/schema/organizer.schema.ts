import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
import { Event } from "src/event/schema/event.schema";
import { User } from "src/user/schema/user.schema";

export enum Status {
  ORGANIZING = "organizing",
  ORGANISED = "organized"
}

@Schema({
  timestamps: true
})
export class Organizer extends Document {
  @ApiProperty({ example: '<userId>', description: 'User ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  userId: User;

  @ApiProperty({ example: '<eventId>', description: 'Event ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Event" })
  eventId: Event;
}

export const OrganizerSchema = SchemaFactory.createForClass(Organizer)