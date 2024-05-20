import { IsArray, IsIn, IsNotEmpty, IsString } from "class-validator";

export class UpdateParticipantStatusDto {
  @IsNotEmpty()
  @IsArray()
  readonly participants: Array<string>;

  @IsNotEmpty()
  @IsString()
  @IsIn(['accepted','rejected','kicked'])
  readonly status: string;
}