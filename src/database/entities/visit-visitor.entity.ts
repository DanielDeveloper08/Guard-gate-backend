import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VisitEntity } from './visit.entity';
import { VisitorEntity } from './visitor.entity';

@Entity({ name: 'visita_visitante' })
export class VisitVisitorEntity {

  @PrimaryGeneratedColumn('increment', { type: 'integer', name: 'id' })
  id!: number;

  @Column('integer', { name: 'id_visita' })
  visitId!: number;

  @Column('integer', { name: 'id_visitante' })
  visitorId!: number;

  @ManyToOne(() => VisitEntity, visit => visit.visitVisitors)
  @JoinColumn([{ name: 'id_visita', referencedColumnName: 'id' }])
  visit!: VisitEntity;

  @ManyToOne(() => VisitorEntity, visitor => visitor.visitVisitors)
  @JoinColumn([{ name: 'id_visitante', referencedColumnName: 'id' }])
  visitor!: VisitorEntity;
}
