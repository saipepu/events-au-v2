import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
import { Unit } from "src/unit/schema/unit.schema";
import { User } from "src/user/schema/user.schema";

@Schema({
  timestamps: true
})
export class UnitMember extends Document {
  @ApiProperty({ example: "<mongoose _id>", description: "User ID" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @ApiProperty({ example: "<mongoose _id>", description: "Unit ID" })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unitId: Unit
}

export const UnitMemberSchema = SchemaFactory.createForClass(UnitMember)