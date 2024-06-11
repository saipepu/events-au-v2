import { IsEmpty, IsOptional } from "class-validator";
import { Organizer } from "src/organizer/schema/organizer.schema";
import { Status } from "../schema/event.schema";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEventDto {
  @ApiProperty({ example: "Event Name", description: "Name of the event." })
  @IsOptional()
  readonly name: string;

  @ApiProperty({ example: "Event Description", description: "Description of the event."})
  @IsOptional()
  readonly description: string;

  @ApiProperty({ example: "2022-12-31", description: "Event Start Date."})
  @IsOptional()
  readonly startDate: string;

  @ApiProperty({ example: "2022-12-31", description: "Event End Date."})
  @IsOptional()
  readonly endDate: string;

  @IsEmpty({ message: "You cannot pass organizer Id"})
  readonly organizer: Organizer;

  @IsEmpty({ message: "You cannot pass Status. Use update-event-status api. Ask developer for more info."})
  readonly status: Status;
}