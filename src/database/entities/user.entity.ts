import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base-entity';
import { TokenOtpEntity } from './token-otp.entity';
import { PersonEntity } from './person.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'usuario' })
export class UserEntity extends BaseEntity {

  @Column('varchar', { name: 'usuario', length: 255 })
  user!: string;

  @Column('varchar', { name: 'contrasenia', length: 255 })
  password!: string;

  @Column('boolean', { name: 'estado', default: true })
  status!: boolean;

  @ManyToOne(() => PersonEntity, (person) => person.users)
  @JoinColumn([{ name: 'id_persona', referencedColumnName: 'id' }])
  person!: PersonEntity;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn([{ name: 'id_rol', referencedColumnName: 'id' }])
  role!: RoleEntity;

  @OneToMany(() => TokenOtpEntity, (tokenOtp) => tokenOtp.user)
  otpCodes!: TokenOtpEntity[];
}
