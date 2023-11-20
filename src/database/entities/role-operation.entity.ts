import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OperationEntity } from './operation.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'rol_operacion' })
export class RoleOperationEntity {

  @PrimaryGeneratedColumn('increment', { type: 'integer', name: 'id' })
  id!: number;

  @ManyToOne(() => RoleEntity, (role) => role.roleOperations)
  @JoinColumn([{ name: 'id_rol', referencedColumnName: 'id' }])
  roles!: RoleEntity[];

  @ManyToOne(() => OperationEntity, (operation) => operation.roleOperations)
  @JoinColumn([{ name: 'id_operacion', referencedColumnName: 'id' }])
  operations!: OperationEntity[];
}
