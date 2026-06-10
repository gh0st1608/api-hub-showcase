import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'frontend',
    description: 'Project group',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  group: string;

  @ApiProperty({
    example: 'API Hub Showcase',
    description: 'Project title',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 'Project description',
    description: 'Optional project description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/project',
    description: 'Project link',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  link: string;

  @ApiProperty({
    example: 'index.html',
    description: 'HTML content or file reference',
  })
  @IsOptional()
  html?: Express.Multer.File;

  @ApiProperty({
    example: 'openapi.yaml',
    description: 'YAML content or file reference',
  })
  @IsOptional()
  yaml?: Express.Multer.File;

  @ApiProperty({
    example: ['demo', 'test'],
    description: 'Project tags',
    required: false,
  })
  @IsOptional()
  @IsArray()
  tags: string[];
}
