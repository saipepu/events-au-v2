import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsEmpty()
  readonly status: string;

  @IsOptional()
  @IsString()
  readonly organizerId: string;
}