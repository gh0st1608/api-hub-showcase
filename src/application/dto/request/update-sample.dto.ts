import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSampleDto {
  @ApiProperty({ example: 'Updated name', description: 'New name for the sample', minLength: 2, required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ example: 'Updated description', description: 'New description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
