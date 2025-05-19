import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Envelope } from '../entity/envelope.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class EnvelopesService {
  constructor(
    @InjectRepository(Envelope)
    private readonly envelopeRepo: Repository<Envelope>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(
    name: string,
    amount: number,
    userId: number,
    month: number,
    year: number,
  ): Promise<Envelope> {
    console.log(userId);
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const envelope = this.envelopeRepo.create({
      name,
      amount,
      user,
      month,
      year,
    });

    return this.envelopeRepo.save(envelope);
  }

  async update(
    id: string,
    newName: string,
    newAmount?: number,
  ): Promise<Envelope> {
    const envelope = await this.envelopeRepo.findOneBy({ id });
    if (!envelope) {
      throw new NotFoundException('Enveloppe non trouvée');
    }

    envelope.name = newName;
    if (newAmount !== undefined) {
      envelope.amount = newAmount;
    }

    return this.envelopeRepo.save(envelope);
  }

  async delete(id: string): Promise<void> {
    const result = await this.envelopeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Enveloppe non trouvée');
    }
  }

  async findByUserAndMonth(
    userId: number,
    month: number,
    year: number,
  ): Promise<Envelope[]> {
    return this.envelopeRepo.find({
      where: {
        user: { id: userId },
        month,
        year,
      },
      relations: ['transactions'],
      order: { name: 'ASC' },
    });
  }
}
