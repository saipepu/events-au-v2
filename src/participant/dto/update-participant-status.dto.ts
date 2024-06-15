import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNotEmpty, IsString } from "class-validator";

export class UpdateParticipantStatusManyDto {
  @ApiProperty({ example: ['<mongoose _id>'], description: 'The ID List of the participants' })
  @IsNotEmpty()
  @IsArray()
  readonly participantIds: Array<string>;

  @ApiProperty({ example: `${['accepted','rejected','kicked'].join(' | ')}`, description: 'One of the Status.' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['accepted','rejected','kicked'])
  readonly status: string;
}

export class UpdateParticipantStatusSingleDto {
  @ApiProperty({ example: '<mongoose _id>', description: 'The ID of the participant' })
  @IsNotEmpty()
  @IsString()
  readonly participantId: string;

  @ApiProperty({ example: `${['accepted','rejected','kicked'].join(' | ')}`, description: 'One of the Status.' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['accepted','rejected','kicked'])
  readonly status: string;
}