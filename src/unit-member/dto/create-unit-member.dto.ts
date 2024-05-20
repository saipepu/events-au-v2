import { IsNotEmpty, IsString } from "class-validator";

export class CreateUnitMemberDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly unitId: string;
}