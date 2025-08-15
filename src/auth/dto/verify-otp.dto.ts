import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyOtpDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '1234', description: '4 digits otp' })
  readonly otp: number;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.test', description: 'Email Address' })
  readonly email: string;
}
