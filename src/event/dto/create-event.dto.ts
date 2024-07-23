import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class CreateEventDto {
  @ApiProperty({ example: "Event Name", description: "Name of the event" })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: "Event Description", description: "Description of the event" })
  @IsOptional()
  readonly description: string;

  @ApiProperty({ example: "Event Location", description: "Location of the event" })
  @IsOptional()
  readonly location: string;

  @ApiProperty({ example: "dd-mm-yyyy or empty", description: "Start date of the event" })
  @Matches(/^$|(^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4})$/, { message: "Invalid start date format. Please use dd-mm-yyyy" })
  @IsOptional()
  readonly startDate: string;

  @ApiProperty({ example: "dd-mm-yyyy or empty", description: "Start date of the event" })
  @Matches(/^$|^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, { message: "Invalid end date format. Please use dd-mm-yyyy" })
  @IsOptional()
  readonly endDate: string;

  @ApiProperty({ example: "hh:mm or empty", description: "Start time of the event" })
  @Matches(/^$|^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid start time format. Please use hh:mm" })
  @IsOptional()
  readonly startTime: string;

  @ApiProperty({ example: "hh:mm or empty", description: "Start time of the event" })
  @Matches(/^$|^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid end time format. Please use hh:mm" })
  @IsOptional()
  readonly endTime: string;

  @ApiProperty({ example: "No Alcohol", description: "Restrictions of the event" })
  @IsOptional()
  readonly rules: string;

  @ApiProperty({ example: "https://www.image.com", description: "Image URL of the event" })
  @IsOptional()
  readonly imageUrl: string;

  @ApiProperty({ example: "<mongoose _id> ![For update use update status route]", description: "Unit ID" })
  @IsNotEmpty({ message: "An Event should belonge to at least one unit."})
  readonly unitId: string;
}