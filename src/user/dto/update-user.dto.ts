import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { User } from "../schema/user.schema";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ example: "User Name", description: "Name of the user" })
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @ApiProperty({ example: "User Last Name", description: "Last Name of the user" })
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @ApiProperty({ example: "testing@gmail.com", description: "Email of the user" })
  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email: string;
}