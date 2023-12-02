import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { VisitEntity } from './visit.entity';

@Entity({ name: 'estado_visita' })
export class VisitStatusEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255 })
  name!: string;

  @OneToMany(() => VisitEntity, visit => visit.residency)
  visits!: VisitEntity[];
}
