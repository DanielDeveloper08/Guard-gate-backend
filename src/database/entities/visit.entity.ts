import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { TypeVisitEntity } from './type-visit.entity';
import { ResidencyEntity } from './residency.entity';
import { VisitStatusEntity } from './visit-status.entity';
import { VisitVisitorEntity } from './visit-visitor.entity';

@Entity({ name: 'visita' })
export class VisitEntity extends BaseEntity {

  @Column('timestamp', {
    name: 'fecha_inicio',
    nullable: false,
  })
  startDate!: Date;

  @Column('timestamp', {
    name: 'fecha_fin',
    nullable: false,
  })
  endDate!: Date;

  @Column('time', {
    name: 'horas_validez',
    nullable: false,
  })
  validityHours!: number;

  @Column('varchar', {
    name: 'motivo',
    length: 255,
  })
  reason!: string;

  @Column('integer', { name: 'id_tipo_visita' })
  typeVisitId!: number;

  @Column('integer', { name: 'id_residencia' })
  residencyId!: number;

  @Column('integer', { name: 'id_estado' })
  statusId!: number;

  @ManyToOne(() => TypeVisitEntity, typeVisit => typeVisit.visits)
  @JoinColumn([{ name: 'id_tipo_visita', referencedColumnName: 'id' }])
  typeVisit!: TypeVisitEntity;

  @ManyToOne(() => ResidencyEntity, residence => residence.visits)
  @JoinColumn([{ name: 'id_residencia', referencedColumnName: 'id' }])
  residency!: ResidencyEntity;

  @ManyToOne(() => VisitStatusEntity, status => status.visits)
  @JoinColumn([{ name: 'id_estado', referencedColumnName: 'id' }])
  status!: VisitStatusEntity;

  @OneToMany(() => VisitVisitorEntity, visitVisitor => visitVisitor.visit)
  visitVisitors!: VisitVisitorEntity[];
}
