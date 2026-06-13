import { ApiProperty } from '@nestjs/swagger';
import { Sample } from '../../../domain/entities/sample.entity';

export class GetSamplesResult {
  @ApiProperty({ type: [Sample], description: 'Page of results' })
  items: Sample[];

  @ApiProperty({ example: 42, description: 'Total number of matching items' })
  count: number;

  @ApiProperty({ example: 2, nullable: true, description: 'Next page number, null when on last page' })
  nextPage: number | null;
}

export class CreateSampleResponseDto {
  @ApiProperty({ example: { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' } })
  sample: { id: string };

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Sample created successfully' })
  message: string;
}

export class ProjectPreviewResponseDto {
  @ApiProperty({ example: 'https://example.com/preview' })
  url: string;
}
