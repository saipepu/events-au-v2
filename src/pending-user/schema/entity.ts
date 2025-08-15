import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

@Schema({
  timestamps: true,
})
export class PendingUser extends Document {

  @ApiProperty({ example: "zawzaw@gmail.com", description: "Email of the user" })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: "1234", description: "OTP 4 digit"})
  @Prop({ required: true })
  otp: string;

  @ApiProperty({ example: false, description: "Email verification status" })
  @Prop({ default: false })
  isVerified: boolean;

}

export const PendingUserSchema = SchemaFactory.createForClass(PendingUser);