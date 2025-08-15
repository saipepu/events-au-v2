import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender, UserAuthLevel } from "../schema/user.schema";

export class CreateUserDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email: string;
  readonly gender?: Gender;
  readonly age?: number;
  readonly phone?: number;
  readonly isAdmin?: boolean;
  readonly hashedPassword?: string;
  readonly picture?: string;
  readonly authLevel?: UserAuthLevel;
  readonly otp?: {
    code: string;
    expiration: Date;
  };
}