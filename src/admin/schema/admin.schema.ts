import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
import { Unit } from "src/unit/schema/unit.schema";
import { User } from "src/user/schema/user.schema";

@Schema({
  timestamps: true
})
export class Admin extends Document {
  @ApiProperty({ example: '<userId>', description: 'User ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @ApiProperty({ example: '<unitId>', description: 'Unit ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unitId: Unit
}

export const AdminSchema = SchemaFactory.createForClass(Admin)