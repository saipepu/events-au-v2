import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInDto {
  @ApiProperty({ example: 'password', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string

  @ApiProperty({ example: 'email', description: 'Email' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email.'})
  readonly email: string
}