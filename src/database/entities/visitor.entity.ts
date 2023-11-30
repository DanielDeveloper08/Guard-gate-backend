import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { VisitVisitorEntity } from './visit-visitor.entity';

@Entity({ name: 'visitante' })
export class VisitorEntity extends BaseEntity {

  @Column('varchar', { name: 'nombres', length: 255 })
  names!: string;

  @Column('varchar', { name: 'apellidos', length: 255 })
  surnames!: string;

  @Column('varchar', { name: 'cedula', length: 255 })
  docNumber!: string;

  @OneToMany(() => VisitVisitorEntity, visitVisitor => visitVisitor.visitor)
  visitVisitors!: VisitVisitorEntity[];
}
