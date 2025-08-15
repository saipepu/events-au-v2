import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FindAllUserQueryDto {
  @ApiPropertyOptional({ description: 'First Name' })
  firstName: string;

  @ApiPropertyOptional({ description: 'Last Name' })
  lastName: string;

  // email
  @ApiPropertyOptional({ description: 'Email Address' })
  email: string;
}