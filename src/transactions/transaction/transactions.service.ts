// src/transactions/transaction.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../entity/transaction.entity';
import { Envelope } from '../../entity/envelope.entity';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';


@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(Envelope)
    private envelopeRepo: Repository<Envelope>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const envelope = await this.envelopeRepo.findOne({
      where: { id: dto.envelopeId },
    });

    if (!envelope) {
      throw new NotFoundException('Envelope not found');
    }

    const transaction = this.transactionRepo.create({
      description: dto.description,
      amount: dto.amount,
      date: dto.date ? new Date(dto.date) : new Date(),
      envelope,
    });

    return this.transactionRepo.save(transaction);
  }

  async findByEnvelope(envelopeId: string): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: { envelope: { id: envelopeId } },
      order: { date: 'DESC' },
    });
  }
}
