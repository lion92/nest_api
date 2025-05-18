import { User } from '../entity/user.entity';

export class TodoDTO {
  readonly title: string;
  readonly description: string;
  readonly user: User;
  jwt?: string;

}