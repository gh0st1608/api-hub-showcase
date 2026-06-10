import { ApiProperty } from '@nestjs/swagger';

export class Sample {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Unique identifier (UUID v4)' })
  public readonly id: string;

  @ApiProperty({ example: 'My first sample', description: 'Human-readable name', minLength: 2 })
  public name: string;

  @ApiProperty({ example: 'A brief description', description: 'Optional longer description', required: false })
  public description?: string;

  @ApiProperty({ example: '2026-05-11T10:00:00.000Z', description: 'ISO 8601 creation timestamp' })
  public readonly createdAt: Date;

  constructor(
    id: string,
    name: string,
    description?: string,
    createdAt: Date = new Date(),
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
  }
}
