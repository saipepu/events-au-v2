import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export enum PROVIDER {
  PASSWORD = 'password',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export class OAuthLoginDto {
  @ApiProperty({ example: 'google', description: 'OAuth provider' })
  @IsNotEmpty()
  @IsString()
  readonly provider: PROVIDER

  @ApiProperty({ example: 'id token', description: 'ID token from OAuth provider' })
  @IsNotEmpty()
  @IsString()
  readonly idToken: string;

}