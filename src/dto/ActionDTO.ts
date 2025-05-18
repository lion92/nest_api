import { User } from '../entity/user.entity';
import { Categorie } from '../entity/categorie.entity';

export class ActionDTO {
  readonly id: number;
  readonly description: string;
  readonly dateAjout: Date;
  readonly dateTransaction: Date;
  readonly montant: number;
  readonly user: User;
  readonly categorie: Categorie;
  jwt?: string;
}