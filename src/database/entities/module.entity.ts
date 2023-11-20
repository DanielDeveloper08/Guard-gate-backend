import { Column, Entity, OneToMany } from 'typeorm';
import { OperationEntity } from './operation.entity';
import { BaseEntity } from '../../shared/base-entity';

@Entity({ name: 'modulo' })
export class ModuleEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255 })
  name!: string;

  @OneToMany(() => OperationEntity, (operation) => operation.module)
  operations!: OperationEntity[];
}
