import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'the name of a coffee', example: 'Rage' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'the brand of a coffee', example: 'Rage Coffee' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'the flavors of a coffee', example: [] })
  @IsString({ each: true })
  readonly flavors: string[];
}
