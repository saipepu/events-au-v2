import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeletePollDto {
  @ApiProperty({ example: 'Poll ID', description: 'ID of the poll to delete' })
  @IsNotEmpty()
  readonly pollId: string;
}
