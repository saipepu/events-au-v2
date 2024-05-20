import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

@Schema({
  timestamps: true
})
export class RestrictedToken extends Document {
  @ApiProperty({ example: '<jwt token>', description: 'Token obtained from SignOut' })
  @Prop({ required: [true, "This field cannot be empty."]})
  token: string;
}

export const RestrictedTokenSchema = SchemaFactory.createForClass(RestrictedToken)