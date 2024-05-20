import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAdminDto {
  @ApiProperty({ example: '<mongoose _id>', description: 'User ID' })
  @IsNotEmpty({ message: "User ID cannot be empty." })
  readonly userId: string;

  @ApiProperty({ example: '<mongoose _id>', description: 'Unit ID' })
  @IsNotEmpty({ message: "An Admin should belong to at least one unit." })
  readonly unitId: string;
}