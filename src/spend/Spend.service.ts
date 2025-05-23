import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionDTO } from '../dto/ActionDTO';
import { Action } from '../entity/action.entity';

@Injectable()
export class SpendService {
  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,

  ) {
  }

  findAll(): Promise<Action[]> {
    return this.actionRepository.find({ relations: ['user', 'categorie'] });
  }

  async findOneBy(id: number): Promise<Action | null> {
    return await this.actionRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async delete(id: number) {
    await this.actionRepository.delete(id);
    console.log('1');
  }

  async create(actionDTO: ActionDTO) {
    await this.actionRepository.save(actionDTO);
  }

  async update(id: number, actionDTO: ActionDTO) {
    await this.actionRepository.update(id, {
      description: actionDTO.description,
      user: actionDTO.user,
      categorie: actionDTO.categorie,
      dateTransaction: actionDTO.dateTransaction,
      montant: parseInt('' + actionDTO.montant),
    });
  }

  async findCategorieSum(id, month, year) {
    console.log(month);
    const qb = this.actionRepository.createQueryBuilder('action');
    qb.select(
      'sum(montant) AS montant,categorieId, color, categorie, action.userId, dateAjout, dateTransaction, categorie.budgetDebutMois as budgetDebutMois',
    );
    qb.innerJoin('action.user', 'user');
    qb.innerJoin('action.categorie', 'categorie');
    qb.where({ user: id })
      .andWhere('EXTRACT(month FROM action.dateTransaction) = ' + month)
      .andWhere('EXTRACT(year FROM action.dateTransaction) = ' + year);
    qb.groupBy('categorieId');
    console.log(qb.getSql());
    return qb.execute();
  }

  async findSum(id, month, year) {
    console.log(month);
    const qb = this.actionRepository.createQueryBuilder('action');
    qb.select(
      'sum(montant) AS montant, action.userId, dateAjout, dateTransaction',
    );
    qb.innerJoin('action.user', 'user');
    qb.where({ user: id })
      .andWhere('EXTRACT(month FROM action.dateTransaction) = ' + month)
      .andWhere('EXTRACT(year FROM action.dateTransaction) = ' + year);
    console.log(qb.getSql());
    return qb.execute();
  }

  async findByUser(id): Promise<any[]> {
    const qb = this.actionRepository.createQueryBuilder('action');
    qb.select(
      'action.id as id, montant, categorie, description, user.id as user, categorie.id as categorieId, dateAjout, dateTransaction',
    );
    qb.innerJoin('action.user', 'user');
    qb.innerJoin('action.categorie', 'categorie');
    qb.where({ user: id });
    console.log(qb.getSql());
    return qb.execute();
  }

  findCategorieSumAll(id) {
    const qb = this.actionRepository.createQueryBuilder('action');
    qb.select(
      'sum(montant) AS montant,categorieId, color, categorie, action.userId, dateAjout, dateTransaction, categorie.budgetDebutMois as budgetDebutMois',
    );
    qb.innerJoin('action.user', 'user');
    qb.where({ user: id });
    qb.innerJoin('action.categorie', 'categorie');
    qb.groupBy('categorieId');
    console.log(qb.getSql());
    return qb.execute();
  }
}
