import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { PersonEntity } from './person.entity';

@Entity({ name: 'residencia' })
export class ResidencyEntity extends BaseEntity {

  @Column('varchar', { name: 'manzana', length: 255 })
  block!: string;

  @Column('varchar', { name: 'villa', length: 255 })
  town!: string;

  @Column('varchar', { name: 'urbanizacion', length: 255 })
  urbanization!: string;

  @Column('boolean', { name: 'es_principal', default: false })
  isMain!: boolean;

  @Column('integer', { name: 'id_persona' })
  personId!: number;

  @ManyToOne(() => PersonEntity, person => person.residences)
  @JoinColumn([{ name: 'id_persona', referencedColumnName: 'id' }])
  person!: PersonEntity;
}
