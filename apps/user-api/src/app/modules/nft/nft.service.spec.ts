import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { NftService } from './nft.service';

describe('NftService', () => {
  let service: NftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NftService,
        {
          provide: getRepositoryToken(Nft),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<NftService>(NftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
