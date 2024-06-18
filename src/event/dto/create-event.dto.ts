import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty } from "class-validator";

export class CreateEventDto {
  @ApiProperty({ example: "Event Name", description: "Name of the event" })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: "Event Description", description: "Description of the event" })
  @Optional()
  readonly description: string;

  @ApiProperty({ example: "Event Location", description: "Location of the event" })
  @Optional()
  readonly location: string;

  @ApiProperty({ example: "2021-12-31T23:59:59.999Z", description: "Start date of the event" })
  @Optional()
  readonly startDate: Date;

  @ApiProperty({ example: "2021-12-31T23:59:59.999Z", description: "End date of the event" })
  @Optional()
  readonly endDate: Date;

  @ApiProperty({ example: "2021-12-31T23:59:59.999Z", description: "Start time of the event" })
  @Optional()
  readonly startTime: Date;

  @ApiProperty({ example: "2021-12-31T23:59:59.999Z", description: "End time of the event" })
  @Optional()
  readonly endTime: Date;

  @ApiProperty({ example: "No Alcohol", description: "Restrictions of the event" })
  @Optional()
  readonly rules: string;

  @ApiProperty({ example: "https://www.image.com", description: "Image URL of the event" })
  @Optional()
  readonly imageUrl: string;

  @ApiProperty({ example: "<mongoose _id>", description: "Unit ID" })
  @IsNotEmpty({ message: "An Event should belonge to at least one unit."})
  readonly unitId: string;
}