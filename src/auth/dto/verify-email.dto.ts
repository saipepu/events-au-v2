import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailDto {
  @ApiProperty({ description: 'The email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The OTP for email verification' })
  @IsNotEmpty()
  @IsString()
  otp: string;
}