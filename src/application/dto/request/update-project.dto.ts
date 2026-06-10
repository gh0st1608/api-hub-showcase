import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'frontend', description: 'Project group', minLength: 1 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  group?: string;

  @ApiPropertyOptional({ example: 'API Hub Showcase', description: 'Project title', minLength: 1 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description', description: 'Project description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/project', description: 'Project link', minLength: 1 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  link?: string;

  @ApiPropertyOptional({ example: 'index.html', description: 'HTML content or file reference' })
  @IsOptional()
  html?: string | File;

  @ApiPropertyOptional({ example: 'openapi.yaml', description: 'YAML content or file reference' })
  @IsOptional()
  yaml?: string | File;

  @ApiPropertyOptional({ example: ['sample', 'ui'], description: 'Project tags' })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
