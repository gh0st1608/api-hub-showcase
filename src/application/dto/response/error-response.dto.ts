import { ApiProperty } from '@nestjs/swagger';

export class ErrorBodyDto {
  @ApiProperty({ example: 1000, description: 'Internal error code from ErrorRegistry' })
  code: number;

  @ApiProperty({ example: 404 })
  httpStatus: number;

  @ApiProperty({ example: '2026-05-11T10:30:00.000Z' })
  dateTime: string;

  @ApiProperty({ example: 'SAMPLE_NOT_FOUND' })
  title: string;

  @ApiProperty({ example: 'Sample not found' })
  message: string;

  @ApiProperty({
    example: 'APPLICATION',
    enum: ['APPLICATION', 'INFRASTRUCTURE', 'INTEGRATION', 'UNKNOWN'],
  })
  layer: string;

  @ApiProperty({ example: '/samples/abc-123', required: false })
  path?: string;

  @ApiProperty({ example: 'GET', required: false })
  method?: string;
}

export class ErrorResponseDto {
  @ApiProperty({ type: ErrorBodyDto })
  Error: ErrorBodyDto;

  @ApiProperty({ type: 'object', nullable: true, example: null, description: 'Always null on error responses' })
  Data: null;
}
