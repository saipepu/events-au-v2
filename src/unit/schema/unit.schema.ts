import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

@Schema({
  timestamps: true
})
export class Unit {
  @ApiProperty({ example: "Unit Name", description: "Name of the unit" })
  @Prop()
  name: string;

  @ApiProperty({ example: "Unit Description", description: "Description of the unit" })
  @Prop()
  description: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit)