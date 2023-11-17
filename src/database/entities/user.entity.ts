import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';

@Entity({ name: 'usuario' })
export class UserEntity extends BaseEntity {

  @Column('varchar', { name: 'usuario', length: 255 })
  user!: string;

  @Column('varchar', { name: 'contrasenia', length: 255 })
  password!: string;

  @Column('boolean', { name: 'estado', default: true })
  status!: boolean;
}
