import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SetUpPasswordDto {
  @ApiProperty({ example: 'password', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email Address' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  readonly email: string;

}