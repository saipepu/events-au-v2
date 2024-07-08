import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class PollResult extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true })
  pollId: string;

  @Prop({
    type: [
      {
        optionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PollOption', required: true },
        answer: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
    required: true,
  })
  result: {
    optionId: mongoose.Types.ObjectId;
    answer: string | boolean;
  }[];
}

export const PollResultSchema = SchemaFactory.createForClass(PollResult);
