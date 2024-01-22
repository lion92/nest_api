import { Injectable } from '@nestjs/common';
import { TodoDTO } from '../dto/todoDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../entity/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  todos = [{
    id: 1,
    title: 'todo app',
    description: 'test',
  }, {
    id: 1,
    title: 'todo app',
    description: 'test',
  }, {
    id: 2,
    title: 'todo app',
    description: 'test',
  }, {
    id: 3,
    title: 'todo app',
    description: 'test',
  }];

  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {
  }

  findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async findOneBy(id: number): Promise<Todo | null> {
    return await this.todoRepository.findOneBy({ id });
  }

  async delete(id: number) {
    await this.todoRepository.delete(id);
    console.log('1');
  }

  async create(todo: TodoDTO) {
    await this.todoRepository.save(todo);
  }

  async update(id: number, todo: TodoDTO) {
    await this.todoRepository.update(id, { title: todo.title, description: todo.description, user: todo.user });
  }

  async findByUser(id) {
    let qb = this.todoRepository.createQueryBuilder('tache');
    qb.select('tache.id as id, user.id as user, description, title, nom, prenom');
    qb.innerJoin('tache.user', 'user');
    qb.where({ user: id });
    console.log(qb.getSql());
    return qb.execute();
  }

}
