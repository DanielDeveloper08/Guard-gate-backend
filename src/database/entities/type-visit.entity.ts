import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { VisitEntity } from './visit.entity';
import { VisitTypeEnum } from '../../enums/visit.enum';

@Entity({ name: 'tipo_visita' })
export class TypeVisitEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255 })
  name!: VisitTypeEnum;

  @OneToMany(() => VisitEntity, (visit) => visit.typeVisit)
  visits!: VisitEntity[];
}
