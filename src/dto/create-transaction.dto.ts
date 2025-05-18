// src/transactions/dto/create-transaction.dto.ts
export class CreateTransactionDto {
  description: string;
  amount: number;
  date?: Date; // si non fourni, on mettra la date actuelle
  envelopeId: string;
}
