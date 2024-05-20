import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @ApiProperty({ example: '<firebase id>', description: 'Firebase Id obtained from Google Auth' })
  @IsNotEmpty()
  @IsString()
  readonly fId: string
}