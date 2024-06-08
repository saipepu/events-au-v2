import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Status } from "../schema/participant.schema";

export class CreateParticipantDto {
  @ApiProperty({ example: '<mongoose _id>', description: 'The ID of the user' })
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @ApiProperty({ example: `${Object.values(Status).join(' | ')}`, description: 'One of the Status.' })
  @IsEmpty()
  readonly status: string;

  @ApiProperty({ example: '<mongoose _id>', description: 'The ID of the Org.' })
  @IsOptional()
  @IsString()
  readonly organizerId: string;
}