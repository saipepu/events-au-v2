import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class PollOption extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  isTextField: boolean;
}

export const PollOptionSchema = SchemaFactory.createForClass(PollOption);
