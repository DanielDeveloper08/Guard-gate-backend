import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { UserEntity } from './user.entity';
import { RoleOperationEntity } from './role-operation.entity';
import { RoleTypeEnum } from '../../enums/role.enum';

@Entity({ name: 'rol' })
export class RoleEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255 })
  name!: RoleTypeEnum;

  @OneToMany(() => UserEntity, (user) => user.role)
  users!: UserEntity[];

  @OneToMany(() => RoleOperationEntity, (roleOperation) => roleOperation.rol)
  roleOperations!: RoleOperationEntity[];
}
