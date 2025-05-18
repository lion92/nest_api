import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../entity/transaction.entity';
import { Envelope } from '../../entity/envelope.entity';
import { TransactionController } from './transactions.controller';
import { TransactionService } from './transactions.service';


@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Envelope])],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService], // facultatif : si tu veux l'utiliser ailleurs
})
export class TransactionsModule {}
