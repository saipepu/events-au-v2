import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignOutDto {
  @ApiProperty({ example: '<jwt token>', description: 'Token obtained from SignIn' })
  @IsNotEmpty()
  @IsString()
  readonly token: string
}