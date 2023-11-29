import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { UserEntity } from './user.entity';
import { ResidencyEntity } from './residency.entity';

@Entity({ name: 'persona' })
export class PersonEntity extends BaseEntity {

  @Column('varchar', { name: 'nombres', length: 255 })
  names!: string;

  @Column('varchar', { name: 'apellidos', length: 255 })
  surnames!: string;

  @Column('varchar', { name: 'correo', length: 255, unique: true })
  email!: string;

  @Column('varchar', { name: 'telefono', length: 15, nullable: true })
  phone!: string | null;

  @OneToMany(() => UserEntity, (user) => user.person)
  users!: UserEntity[];

  @OneToMany(() => ResidencyEntity, (residency) => residency.person)
  residences!: ResidencyEntity[];
}
