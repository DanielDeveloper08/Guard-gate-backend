import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'persona' })
export class PersonEntity extends BaseEntity {

  @Column('varchar', { name: 'nombres', length: 255 })
  names!: string;

  @Column('varchar', { name: 'apellidos', length: 255 })
  surnames!: string;

  @Column('varchar', { name: 'correo', length: 255, nullable: true })
  email!: string | null;

  @Column('varchar', { name: 'telefono', length: 15, nullable: true })
  phone!: string | null;

  @OneToMany(() => UserEntity, (user) => user.person)
  users!: UserEntity[];
}
