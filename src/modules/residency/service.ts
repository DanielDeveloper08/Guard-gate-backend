import { EntityManager } from 'typeorm';
import { ResidencyRepository } from './repository';
import { PaginationI } from '../../interfaces/global.interface';
import { ResidencyDTO, ResidencyMassiveDTO, ResidencyMassiveRequest } from '../../interfaces/residency.interface';
import { ResidencyEntity } from '../../database';
import { ServiceException } from '../../shared/service-exception';
import {
  EXISTS_RECORD,
  NO_EXIST_RECORD,
  RECORD_CREATED_FAIL,
  RECORD_DELETE,
  RECORD_DELETE_FAIL,
  RECORD_EDIT,
  RECORD_EDIT_FAIL,
  RECORD_UPSERT_FAIL,
} from '../../shared/messages';
import { PersonRespository } from '../person/repository';

export class ResidencyService {

  constructor(
    private readonly _repo = new ResidencyRepository(),
    private readonly _repoPerson = new PersonRespository(),
  ) {}

  async getAll(cnx: EntityManager, payload: PaginationI) {
    const data = await this._repo.getAll(cnx, payload);
    return data;
  }

  async getOne(cnx: EntityManager, id: number) {
    const residency = await this._repo.getById(cnx, id);

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('la residencia'));
    }

    return residency;
  }

  async create(cnx: EntityManager, payload: ResidencyDTO) {
    return cnx.transaction(async (cnxTran) => {
      const { block, town, personId } = payload;

      const person = await this._repoPerson.getById(cnxTran, personId);

      if (!person) {
        throw new ServiceException(NO_EXIST_RECORD('persona'));
      }

      const existsResidency = await this._repo.getByPersonId(cnxTran, personId);
      const residencesByBlock = await this._repo.getByBlock(cnxTran, block) ?? [];

      const existsTown = residencesByBlock.find(r => r.town === town);

      if (existsTown) {
        throw new ServiceException(
          EXISTS_RECORD(`villa dentro de la manzana: ${block}`)
        );
      }

      const residencyData = {
        block,
        town,
        personId,
        isMain: !existsResidency,
      } as ResidencyEntity;

      const residencyCreated = await this._repo.create(cnxTran, residencyData);

      if (!residencyCreated) {
        throw new ServiceException(RECORD_CREATED_FAIL('la residencia'));
      }

      return residencyCreated;
    });
  }

  async upsertMany(cnx: EntityManager, payload: ResidencyMassiveRequest) {
    return cnx.transaction(async (cnxTran) => {
      const {personId,residences} = payload;

      const person = await this._repoPerson.getById(cnxTran, personId);

      var residencesUpserted:ResidencyMassiveDTO[]=[];

      if (!person) {
        throw new ServiceException(NO_EXIST_RECORD('persona'));
      }

      for(const residency of residences){
        const { id, block, town, isMain } = residency;

        const residencyData = {
          block,
          town,
          personId,
          isMain,
        } as ResidencyEntity;

        var residencyUpserted:ResidencyMassiveDTO;

        if(id===0){
          const insertResult = await this._repo.create(cnxTran, residencyData);
          if (!insertResult) {
            throw new ServiceException(RECORD_UPSERT_FAIL('una de las residencias.'));
          }
          residencyUpserted = (await this._repo.getById(cnxTran,insertResult.id)) as ResidencyMassiveDTO;
        }
        else{
          const updateResult = await this._repo.update(cnxTran, id,residencyData);
          if (updateResult==0) {
            throw new ServiceException(RECORD_UPSERT_FAIL('una de las residencias.'));
          }
          residencyUpserted = await this._repo.getById(cnxTran,id) as ResidencyMassiveDTO;
        }

        residencesUpserted.push(residencyUpserted);
      };


      return residencesUpserted;
    });
  }

  async update(cnx: EntityManager, id: number, payload: ResidencyDTO) {
    return cnx.transaction(async (cnxTran) => {
      const { block, town, personId } = payload;

      const residency = await this._repo.getById(cnxTran, id);
      const person = await this._repoPerson.getById(cnxTran, personId);

      if (!residency) {
        throw new ServiceException(NO_EXIST_RECORD('la residencia'));
      }

      if (!person) {
        throw new ServiceException(NO_EXIST_RECORD('persona'));
      }

      const residencyData = {
        block,
        town,
        personId,
      } as ResidencyEntity;

      const residencyUpdated = await this._repo.update(cnxTran, id, residencyData);

      if (!residencyUpdated) {
        throw new ServiceException(RECORD_EDIT_FAIL('la residencia'));
      }

      return RECORD_EDIT('Residencia');
    });
  }

  async remove(cnx: EntityManager, id: number) {
    const residency = await this._repo.getById(cnx, id);

    if (!residency) {
      throw new ServiceException(NO_EXIST_RECORD('la residencia'));
    }

    const residencyRemoved = await this._repo.remove(cnx, id);

    if (!residencyRemoved) {
      throw new ServiceException(RECORD_DELETE_FAIL('la residencia'));
    }

    return RECORD_DELETE('Residencia');
  }
}
