import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEventUnitDto {
  @ApiProperty({ example: '<eventId>', description: 'Event ID' })
  @IsNotEmpty()
  @IsString()
  readonly eventId: string;

  @ApiProperty({ example: '<unitId>', description: 'Unit ID' })
  @IsNotEmpty()
  @IsString()
  readonly unitId: string;
}