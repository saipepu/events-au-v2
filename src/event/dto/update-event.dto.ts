import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateEventDto } from "./create-event.dto";
import { IsEmpty } from "class-validator";

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({ description: "Use update status route to update the status of the unit." })
  @IsEmpty()
  readonly unitId: string;
}