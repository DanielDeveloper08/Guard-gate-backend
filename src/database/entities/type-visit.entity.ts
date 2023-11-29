import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';

@Entity({ name: 'tipo_visita' })
export class TypeVisitEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255 })
  name!: string;
}
