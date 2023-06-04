import { Test, TestingModule } from '@nestjs/testing';
import { mockDataServiceFactory } from '../../core/factories/mock-data-service.factory';
import { NftOwnerItemService } from '@nft/api-modules/nft-owner/nft-owner.service';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

describe('NftController', () => {
  let controller: NftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftController],
      providers: [
        {
          provide: NftService,
          useValue: mockDataServiceFactory(),
        },
        {
          provide: NftOwnerItemService,
          useValue: mockDataServiceFactory(),
        },
      ],
    }).compile();

    controller = module.get<NftController>(NftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
