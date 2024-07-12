import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreatePollOptionDto {
  @ApiProperty({ example: 'Option Title', description: 'Title of the poll option' })
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ example: false, description: 'Indicates if the option is a text field' })
  @IsBoolean()
  readonly isTextField: boolean;
}

export class CreatePollDto {
  @ApiProperty({ example: 'Event ID', description: 'ID of the event the poll belongs to' })
  @IsNotEmpty()
  readonly eventId: string;

  @ApiProperty({ example: 'Poll Title', description: 'Title of the poll' })
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ example: true, description: 'Indicates if the poll allows multiple selections' })
  @IsBoolean()
  readonly multi_select: boolean;

  @ApiProperty({ type: [CreatePollOptionDto], description: 'Options for the poll' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePollOptionDto)
  readonly options: CreatePollOptionDto[];
}
