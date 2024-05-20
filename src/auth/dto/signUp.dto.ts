import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {
  @ApiProperty({ example: 'John', description: 'First Name' })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string

  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email.'})
  readonly email: string

  @ApiProperty({ example: '<firebase id>', description: 'Firebase Id obtained from Google Auth' })
  @IsNotEmpty()
  @IsString()
  readonly fId: string

  @ApiProperty({ example: '<mongoose _id>', description: 'Unit ID' })
  @IsOptional()
  @IsString()
  readonly unitId: string
}