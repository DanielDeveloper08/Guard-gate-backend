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
    nullable: true,
  })
  startDate!: Date;

  @Column('timestamp', {
    name: 'fecha_fin',
    nullable: true,
  })
  endDate!: Date;

  @Column('integer', {
    name: 'horas_validez',
    nullable: true,
  })
  validityHours!: number;

  @Column('varchar', {
    name: 'motivo',
    length: 255,
    nullable: true,
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
