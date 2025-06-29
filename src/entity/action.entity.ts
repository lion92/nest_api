import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { categorieModule } from '../categorie/Categorie.module';
import { Module } from '@nestjs/common';
import { Categorie } from './categorie.entity';

@Module({
  imports: [categorieModule],
})


@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: '0.00' })
  montant: number;

  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  dateAjout: Date;

  @Column({ type: 'datetime', nullable: true })
  dateTransaction: Date;
  @ManyToOne(() => Categorie, author => Categorie, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ManyToOne(type => Categorie, categorie => categorie.id) categorie: Categorie;

  @ManyToOne(type => User, user => user.id) user: User;

}