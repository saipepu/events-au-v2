import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
import { Admin } from "src/admin/schema/admin.schema";
import { Unit } from "src/unit/schema/unit.schema";

@Schema({
  timestamps: true
})
export class UnitAdmin extends Document {
  @ApiProperty({ example: 'adminId', description: 'Admin ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  adminId: Admin;

  @ApiProperty({ example: 'unitId', description: 'Unit ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' })
  unitId: Unit
}

export const UnitAdminSchema = SchemaFactory.createForClass(UnitAdmin)