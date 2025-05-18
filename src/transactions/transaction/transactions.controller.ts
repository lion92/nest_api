// src/transactions/transaction.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.create(dto);
  }

  @Get('envelope/:id')
  async getByEnvelope(@Param('id') envelopeId: string) {
    return this.transactionService.findByEnvelope(envelopeId);
  }
}
