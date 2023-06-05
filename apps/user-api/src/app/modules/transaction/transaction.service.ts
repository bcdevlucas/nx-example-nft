import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly nftRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionInput: CreateTransactionInput): Promise<Transaction> {
    const transaction = this.nftRepository.create(createTransactionInput as DeepPartial<Transaction>);
    return await this.nftRepository.save(transaction);
  }

  async findAll(): Promise<Array<Transaction>> {
    return await this.nftRepository.find();
  }

  async findOne(transactionId: string): Promise<Transaction> {
    const transaction = await this.nftRepository.findOne({ where: { id: transactionId } });
    if (!transaction) {
      throw new NotFoundException(`Transaction #${transactionId} not found`);
    }
    return transaction;
  }

  async update(
    transactionId: string,
    updateTransactionInput: UpdateTransactionInput,
  ): Promise<Transaction> {
    const transaction = await this.nftRepository.preload({
      id: transactionId,
      ...updateTransactionInput,
    } as DeepPartial<Transaction>);
    if (!transaction) {
      throw new NotFoundException(`Transaction #${transactionId} not found`);
    }
    return this.nftRepository.save(transaction);
  }

  async remove(transactionId: string): Promise<Transaction> {
    const transaction = await this.findOne(transactionId);
    await this.nftRepository.remove(transaction);
    return transaction;
  }
}
