import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({ description: 'offset query of pagination', example: '10' })
  @IsOptional()
  @IsPositive()
  readonly offset: number;

  @ApiProperty({ description: 'limit query of pagination', example: '10' })
  @IsOptional()
  @IsPositive()
  readonly limit: number;
}
