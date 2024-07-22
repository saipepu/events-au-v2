import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { PollOption, PollOptionSchema } from './poll-option.schema';

@Schema({
  timestamps: true,
})
export class Poll extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true })
  eventId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  multi_select: boolean;

  @Prop({ type: [PollOptionSchema], default: [] })
  options: PollOption[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);
