import { Test, TestingModule } from '@nestjs/testing';
import { mockDataServiceFactory } from '../../core/factories/mock-data-service.factory';
import { NftOwnerItemService } from '@nft/api-modules/nft-owner/nft-owner.service';
import { NftOwnerItemController } from './nft-owner.controller';

describe('NftOwnerItemsController', () => {
  let controller: NftOwnerItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftOwnerItemController],
      providers: [
        {
          provide: NftOwnerItemService,
          useValue: mockDataServiceFactory(),
        },
      ],
    }).compile();

    controller = module.get(NftOwnerItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
