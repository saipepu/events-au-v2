import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SignUpDto {
  @ApiProperty({ example: 'John', description: 'First Name' })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string

  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email.'})
  readonly email: string

  @ApiProperty({ example: '123456788', description: 'Phone Number' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Phone number must be a number.'})
  readonly phone: number

  @ApiProperty({ example: '<mongoose _id>', description: 'Unit ID' })
  @IsOptional()
  @IsString()
  readonly unitId: string

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string
}