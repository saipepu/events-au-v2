import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested, IsString, IsBoolean, IsMongoId, isBooleanString } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { IsBooleanOrString } from '../is-boolean-or-string.decorator';

class PollAnswerDto {
  @ApiProperty({ example: 'Option ID', description: 'ID of the poll option' })
  @IsNotEmpty()
  @IsMongoId()
  readonly optionId: Types.ObjectId;

  @ApiProperty({ example: 'Answer', description: 'Answer to the poll option' })
  @IsNotEmpty()
  @IsBooleanOrString() // Adjust this as per your requirement if answer can be of different types
  readonly answer: string | boolean;
}

export class CreatePollResultDto {
  @ApiProperty({ example: 'User ID', description: 'ID of the user filling the poll' })
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty({ example: 'Poll ID', description: 'ID of the poll' })
  @IsNotEmpty()
  readonly pollId: string;

  @ApiProperty({ type: [PollAnswerDto], description: 'List of answers to poll options' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PollAnswerDto)
  readonly result: PollAnswerDto[];
}
