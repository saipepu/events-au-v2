import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose"

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  REJECTED = "rejected"
}

@Schema({
  timestamps: true
})
export class Event extends Document {
  @ApiProperty({ example: "Event name", description: "Name of the event" })
  @Prop({ required: [true, "Event name is required"]})
  name: string;

  @ApiProperty({ example: "Event description", description: "Description of the event" })
  @Prop()
  description: string;

  @ApiProperty({ example: "2022-12-31", description: "Start date of the event" })
  @Prop()
  startDate: string;

  @ApiProperty({ example: "2022-12-31", description: "End date of the event" })
  @Prop()
  endDate: string;

  @ApiProperty({ example: "08:00", description: "Start time of the event" })
  @Prop()
  startTime: string;

  @ApiProperty({ example: "17:00", description: "End time of the event" })
  @Prop()
  endTime: string;

  @ApiProperty({ example: "John Paul II", description: "Location of the event" })
  @Prop()
  location: string;

  @ApiProperty({ example: "No alcohol", description: "Rules of the event" })
  @Prop()
  rules: string;

  @ApiProperty({ example: "Event cover image URL", description: "Cover image URL of the event" })
  @Prop()
  coverImageUrl: string;

  @ApiProperty({ example: "<mongoose _id>", description: "Admin ID" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  adminId: string;

  @ApiProperty({ example: `${Object.values(Status).join(' | ')}`, description: "Status of the event" })
  @Prop({ default: "pending" })
  status: Status;

}

export const EventSchema = SchemaFactory.createForClass(Event)