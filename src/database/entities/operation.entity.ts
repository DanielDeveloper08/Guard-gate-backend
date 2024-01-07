import { Column, Entity, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { ModuleEntity } from './module.entity';
import { RoleOperationEntity } from './role-operation.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'operacion' })
export class OperationEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255 })
  name!: string;

  @Column('varchar', { name: 'ruta' , nullable:true})
  route?: string;

  @Column('integer', { name: 'id_modulo' })
  moduleId!: number;

  @ManyToOne(() => ModuleEntity, (module) => module.operations)
  @JoinColumn([{ name: 'id_modulo', referencedColumnName: 'id' }])
  module!: ModuleEntity;

  @OneToMany(() => RoleOperationEntity, (roleOperation) => roleOperation.operation)
  roleOperations!: RoleOperationEntity[];

  @ManyToMany(() => RoleEntity, role=>role.operations)
  @JoinTable({
    name: 'rol_operacion',
    joinColumn: { name: 'id_operacion' },
    inverseJoinColumn: { name: 'id_rol' },
  })
  roles!: RoleEntity[];
}
