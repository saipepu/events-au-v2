import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SignUpDto {
  @ApiPropertyOptional({ example: 'John', description: 'First Name' })
  readonly firstName?: string

  @ApiProperty({ example: 'Doe@gmail.com', description: 'Last Name' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email.'})
  readonly email: string
}