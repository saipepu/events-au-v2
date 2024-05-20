import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNotEmpty, IsString } from "class-validator";

export class updateEventUnitDto {
  @ApiProperty({ example: 'remove', description: 'Action to perform' })
  @IsNotEmpty()
  @IsIn(['remove', 'add'])
  @IsString()
  readonly action: string;

  @ApiProperty({ example: ['<unitId>'], description: 'Unit IDs' })
  @IsNotEmpty()
  @IsArray()
  readonly units: Array<string>
}