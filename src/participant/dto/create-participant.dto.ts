import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Status } from "../schema/participant.schema";

export class CreateParticipantDto {
  @ApiProperty({ example: '<mongoose _id>', description: 'The ID of the Event' })
  @IsNotEmpty()
  @IsString()
  readonly eventId: string;

  @ApiProperty({ example: '<mongoose _id>', description: 'The ID of the user' })
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}