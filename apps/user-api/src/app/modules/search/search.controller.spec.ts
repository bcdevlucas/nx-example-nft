import { Test, TestingModule } from '@nestjs/testing';
import { mockDataServiceFactory } from '../../core/factories/mock-data-service.factory';
import { NftOwnerItemService } from '@nft/api-modules/nft-owner/nft-owner.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('NftController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockDataServiceFactory(),
        },
        {
          provide: NftOwnerItemService,
          useValue: mockDataServiceFactory(),
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
