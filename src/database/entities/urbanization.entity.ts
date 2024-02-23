import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';

@Entity('urbanizacion')
export class UrbanizationEntity extends BaseEntity {

  @Column('varchar', { name: 'nombre', length: 255, unique: true })
  name!: string;

  @Column('varchar', { name: 'direccion', length: 255 })
  address!: string;
}
