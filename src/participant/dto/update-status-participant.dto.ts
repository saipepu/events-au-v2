import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNotEmpty, IsString } from "class-validator";

export class UpdateParticipantStatusDto {
  @ApiProperty({ example: ['<mongoose _id>'], description: 'The ID List of the participants' })
  @IsNotEmpty()
  @IsArray()
  readonly participants: Array<string>;

  @ApiProperty({ example: `${['accepted','rejected','kicked'].join(' | ')}`, description: 'One of the Status.' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['accepted','rejected','kicked'])
  readonly status: string;
}