import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { ResidencyEntity } from './residency.entity';
import { VisitVisitorEntity } from './visit-visitor.entity';
import { VisitTypeEnum, VisitStatusEnum } from '../../enums/visit.enum';

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

  @Column('enum', {
    name: 'tipo',
    enum: VisitTypeEnum,
    default: VisitTypeEnum.QR,
  })
  type!: VisitTypeEnum;

  @Column('enum', {
    name: 'estado',
    enum: VisitStatusEnum,
    default: VisitStatusEnum.PENDING,
  })
  status!: VisitStatusEnum;

  @Column('integer', { name: 'id_residencia' })
  residencyId!: number;

  @ManyToOne(() => ResidencyEntity, (residence) => residence.visits)
  @JoinColumn([{ name: 'id_residencia', referencedColumnName: 'id' }])
  residency!: ResidencyEntity;

  @OneToMany(() => VisitVisitorEntity, (visitVisitor) => visitVisitor.visit)
  visitVisitors!: VisitVisitorEntity[];
}
