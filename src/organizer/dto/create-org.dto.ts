import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateOrgDto {
  @ApiProperty({ example: '<userId>', description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @ApiProperty({ example: '<eventId>', description: 'Event ID' })
  @IsNotEmpty()
  @IsString()
  readonly eventId: string;

  @ApiProperty({ example: 'pending', description: 'Status' })
  @IsEmpty()
  @IsString()
  readonly status: string;
}