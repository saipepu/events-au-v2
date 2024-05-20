import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUnitDto {
  @ApiProperty({ example: "Unit Name", description: "Name of the unit" })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ example: "Unit Description", description: "Description of the unit" })
  @IsOptional()
  @IsString()
  readonly description: string;
}