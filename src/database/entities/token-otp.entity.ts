import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'token_otp' })
export class TokenOtpEntity extends BaseEntity {

  @Column('varchar', { name: 'codigo', length: 8 })
  code!: string;

  @Column('boolean', { name: 'usado', default: false })
  used!: boolean;

  @Column('integer', { name: 'id_usuario' })
  userId!: number;

  @Column('boolean', { name: 'estado', default: true })
  status!: boolean;

  @ManyToOne(() => UserEntity, (user) => user.otpCodes)
  @JoinColumn([{ name: 'id_usuario', referencedColumnName: 'id' }])
  user!: UserEntity;
}
