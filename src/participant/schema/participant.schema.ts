import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
import { timestamp } from "rxjs";
import { Event } from "src/event/schema/event.schema";
import { Organizer } from "src/organizer/schema/organizer.schema";
import { User } from "src/user/schema/user.schema";

export enum Status {
  PENDING = "pending",
  PARTICIPATING = "participating", // accepted
  PARTICIPATED = "participated",
  REJECTED = "rejected"
}

@Schema({
  timestamps: true
})
export class Participant extends Document {
  @ApiProperty({ example: "<mongoose _id>", description: "User ID" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  userId: User;

  @ApiProperty({ example: "<mongoose _id>", description: "Event ID" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Event" })
  eventId: Event;

  @ApiProperty({ example: "<mongoose _id>", description: "Organizer ID" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Organizer" })
  organzierId: Organizer;

  @ApiProperty({ example: `${Object.values(Status).join(' | ')}`, description: "Status of the participant" })
  @Prop({ default: "pending" })
  status: Status;

  @ApiProperty({ example: "JohnDoe@gmail.com", description: "Email of the participant" })
  @Prop()
  email: string;

  @ApiProperty({ example: "123456789", description: "Phone Number" })
  @Prop()
  phone: number;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant)