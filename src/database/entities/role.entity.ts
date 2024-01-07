import { Column, Entity, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { UserEntity } from './user.entity';
import { RoleOperationEntity } from './role-operation.entity';
import { RoleTypeEnum } from '../../enums/role.enum';
import { OperationEntity } from './operation.entity';

@Entity({ name: 'rol' })
export class RoleEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255 })
  name!: RoleTypeEnum;

  @OneToMany(() => UserEntity, (user) => user.role)
  users!: UserEntity[];

  @OneToMany(() => RoleOperationEntity, (roleOperation) => roleOperation.rol)
  roleOperations!: RoleOperationEntity[];

  @ManyToMany(() => OperationEntity, operation=>operation.roles)
  @JoinTable({
    name: 'rol_operacion',
    joinColumn: { name: 'id_rol' },
    inverseJoinColumn: { name: 'id_operacion' },
  })
  operations!: OperationEntity[];
}
