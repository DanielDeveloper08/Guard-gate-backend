import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'integer', name: 'id' })
  id!: number;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_creacion' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'fecha_edicion' })
  updatedAt!: Date;
}
