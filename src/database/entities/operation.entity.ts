import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { ModuleEntity } from './module.entity';
import { RoleOperationEntity } from './role-operation.entity';

@Entity({ name: 'operacion' })
export class OperationEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255 })
  name!: string;

  @Column('integer', { name: 'id_modulo' })
  moduleId!: number;

  @ManyToOne(() => ModuleEntity, (module) => module.operations)
  @JoinColumn([{ name: 'id_modulo', referencedColumnName: 'id' }])
  module!: ModuleEntity;

  @OneToMany(() => RoleOperationEntity, (roleOperation) => roleOperation.operation)
  roleOperations!: RoleOperationEntity[];
}
