import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty } from "class-validator";

export class CreateEventDto {
  @ApiProperty({ example: "Event Name", description: "Name of the event" })
  @IsNotEmpty()
  readonly name: string;

  @IsEmpty({ message: "You cannot pass organizer Id"})
  readonly organizer: string;

  @ApiProperty({ example: "<mongoose _id>", description: "Unit ID" })
  @IsNotEmpty({ message: "An Event should belonge to at least one unit."})
  readonly unitId: string;
}