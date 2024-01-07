import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OperationEntity } from './operation.entity';
import { RoleEntity } from './role.entity';
import { BaseEntity } from '../../shared/base-entity';

@Entity({ name: 'rol_operacion' })
export class RoleOperationEntity{
  @PrimaryGeneratedColumn('increment', { type: 'integer', name: 'id' })
  id!: number;

  @Column('integer', { name: 'id_rol' })
  roleId!: number;
  @Column('integer', { name: 'id_operacion' })
  operationId!: number;

  @ManyToOne(() => RoleEntity, (role) => role.roleOperations)
  rol!: RoleEntity;

  @ManyToOne(() => OperationEntity, (operation) => operation.roleOperations)
  operation!: OperationEntity;
}
