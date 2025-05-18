// src/envelopes/envelope.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';


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

  @OneToMany(() => Transaction, (transaction) => transaction.envelope, { cascade: true })
  transactions: Transaction[];
}
