import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Organizer } from "src/organizer/schema/organizer.schema";
import { Status } from "../schema/event.schema";
import { ApiProperty } from "@nestjs/swagger";


export class UpdateEventStatusDto {
  @IsEmpty({ message: "You cannot pass organizer id." })
  readonly organizer: Organizer;

  @ApiProperty({ example: `${Object.values(Status).join(' | ')}`, description: 'Status of the event. Admin can only approved or rejected' })
  @IsNotEmpty({ message: "Status cannot be empty." })
  readonly status: Status;

  @ApiProperty({ example: '<admin id>', description: 'Id of the admin who is updating the status.' })
  @IsOptional()
  @IsString()
  readonly adminId: string;
}