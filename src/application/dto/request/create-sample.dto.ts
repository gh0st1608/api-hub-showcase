import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSampleDto {
  @ApiProperty({ example: 'My first sample', description: 'Human-readable name', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'A brief description', description: 'Optional longer description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
