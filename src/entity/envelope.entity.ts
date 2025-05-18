import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity()
export class Envelope {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  month: number;

  @Column()
  year: number;

  @ManyToOne(() => User, (user) => user.envelopes)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.envelope)
  transactions: Transaction[];
}
