import { Brackets, EntityManager } from 'typeorm';
import {
  PersonEntity,
  ResidencyEntity,
  RoleEntity,
  UserEntity,
} from '../../database';
import { MainResidencyI, UserI, UserResidencesI, UserRoleI } from '../../interfaces/user.interface';
import { RoleTypeEnum } from '../../enums/role.enum';

export class UserRepository {

  getAll(cnx: EntityManager) {
    return cnx.find(
      UserEntity,
      { select: ['id', 'user', 'status'] }
    );
  }

  getByUsername(cnx: EntityManager, username: string, withPass: boolean = false) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'user.id as id',
        'person.nombres as names',
        'person.apellidos as surnames',
        'person.correo as email',
        'person.telefono as phone',
        'role.name as role',
      ])
      .from(UserEntity, 'user')
      .leftJoin(PersonEntity, 'person', 'user.id_persona = person.id')
      .leftJoin(RoleEntity, 'role', 'user.id_rol = role.id')
      .where('user.usuario = :username', { username })
      .andWhere('user.estado = :status', { status: true });

    if (withPass) {
      query.addSelect('user.contrasenia as password');
    }

    return query.getRawOne<UserI>();
  }

  getById(cnx: EntityManager, id: number) {
    return cnx.findOne(UserEntity, {
      where: { id },
    });
  }

  getResidencesByUserId(cnx: EntityManager, id: number, showMain: boolean = false) {
    const residencyQuery = cnx
      .createQueryBuilder()
      .select([
        'residency.id as "residencyId"',
        'residency.id_persona as "personId"',
        'residency.manzana as block',
        'residency.villa as town',
        'residency.urbanizacion as urbanization',
        'residency.es_principal as "isMain"',
      ])
      .from(ResidencyEntity, 'residency')
      .where('residency.id_persona = person.id')
      .andWhere(
        new Brackets(qb => {
          if (showMain) {
            return qb.where('residency.es_principal = true');
          }
        })
      )
      .orderBy('residency.id', 'ASC')
      .getQuery();

    const query = cnx
      .createQueryBuilder()
      .select([
        'user.id as id',
        'user.usuario as username',
        'UPPER(person.nombres) as names',
        'UPPER(person.apellidos) as surnames',
      ])
      .addSelect([
        `
        (
          SELECT COALESCE(json_agg(row_to_json(item)), '[]'::json)
          FROM (${residencyQuery}) item
        ) AS "residences"
      `,
      ])
      .from(UserEntity, 'user')
      .leftJoin(PersonEntity, 'person', 'user.id_persona = person.id')
      .where('user.id = :id', { id })
      .andWhere('user.estado = :status', { status: true });

    return query.getRawOne<UserResidencesI>();
  }

  getAllUsers(cnx: EntityManager, showMain: boolean = false) {
    return cnx.find(
      UserEntity,
      { 
        relations: ['person','role'],
      },
    );
  }

  getUserById(cnx: EntityManager, id:number) {
    return cnx.findOne(
      UserEntity,
      { 
        where:{id:id},
        relations: ['person','role'],
      },
    );
  }

  getMainResidency(cnx: EntityManager, id: number) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'residency.id as id',
        'residency.urbanizacion as urbanization',
      ])
      .from(UserEntity, 'user')
      .leftJoin(PersonEntity, 'person', 'user.id_persona = person.id')
      .leftJoin(
        ResidencyEntity,
        'residency',
        'person.id = residency.id_persona'
      )
      .where('user.id = :id', { id })
      .andWhere('user.estado = true')
      .andWhere('residency.es_principal = true');

    return query.getRawOne<MainResidencyI>();
  }

  async getByRole(cnx: EntityManager, role: RoleTypeEnum) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'user.id as id',
        'person.nombres as names',
        'person.apellidos as surnames',
        'role.name as role',
        'person.id as "personId"',
      ])
      .from(UserEntity, 'user')
      .leftJoin(PersonEntity, 'person', 'user.id_persona = person.id')
      .leftJoin(RoleEntity, 'role', 'user.id_rol = role.id')
      .where('role.name = :role', { role })
      .andWhere('user.estado = :status', { status: true });

    return query.getRawOne<UserRoleI>();
  }

  create(cnx: EntityManager, payload: UserEntity) {
    const insert = cnx.create(UserEntity, payload);
    return cnx.save(insert);
  }

  async update(cnx: EntityManager, id: number, payload: UserEntity) {
    const update = await cnx.update(UserEntity, { id }, payload);

    return update.affected;
  }
}
