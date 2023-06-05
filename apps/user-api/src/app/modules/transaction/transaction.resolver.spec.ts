import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
