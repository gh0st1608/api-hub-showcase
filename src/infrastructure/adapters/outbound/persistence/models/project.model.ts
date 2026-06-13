import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class ProjectModel {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 120, name: 'group_name' })
  group: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  link: string;

  @Column({ type: 'text', nullable: true, default: '' })
  html: string;

  @Column({ type: 'text', nullable: true, default: '' })
  yaml: string;

  @Column({
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  tags: string[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
