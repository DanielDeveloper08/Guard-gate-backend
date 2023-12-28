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

  @Column('boolean', { name: 'ha_ingresado', default: false })
  hasEntered!: boolean;

  @Column('timestamp', {
    name: 'fecha_ingreso',
    nullable: true,
    default: () => 'null',
  })
  entryDate!: Date | null;

  @Column('varchar', {
    name: 'placa_carro',
    length: 255,
    nullable: true,
  })
  carPlate!: string;

  @Column('json', {
    name: 'fotos',
    nullable: true,
    default: () => 'null',
  })
  photos!: string;

  @Column('varchar', {
    name: 'observacion',
    length: 255,
    nullable: true,
  })
  observation!: string;

  @ManyToOne(() => VisitEntity, visit => visit.visitVisitors)
  @JoinColumn([{ name: 'id_visita', referencedColumnName: 'id' }])
  visit!: VisitEntity;

  @ManyToOne(() => VisitorEntity, visitor => visitor.visitVisitors)
  @JoinColumn([{ name: 'id_visitante', referencedColumnName: 'id' }])
  visitor!: VisitorEntity;
}
