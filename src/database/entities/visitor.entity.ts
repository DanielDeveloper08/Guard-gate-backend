import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { VisitVisitorEntity } from './visit-visitor.entity';
import { ResidencyEntity } from './residency.entity';

@Entity({ name: 'visitante' })
export class VisitorEntity extends BaseEntity {

  @Column('varchar', { name: 'nombres', length: 255 })
  names!: string;

  @Column('varchar', { name: 'apellidos', length: 255 })
  surnames!: string;

  @Column('varchar', { name: 'cedula', length: 255 })
  docNumber!: string;

  @Column('integer', { name: 'id_residencia' })
  residencyId!: number;

  @ManyToOne(() => ResidencyEntity, (residence) => residence.visitors)
  @JoinColumn([{ name: 'id_residencia', referencedColumnName: 'id' }])
  residency!: ResidencyEntity;

  @OneToMany(() => VisitVisitorEntity, (visitVisitor) => visitVisitor.visitor)
  visitVisitors!: VisitVisitorEntity[];
}
