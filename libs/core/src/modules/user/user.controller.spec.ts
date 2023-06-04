import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { mockDataServiceFactory } from '@nft/user-api-core/factories/mock-data-service.factory';
import { MediaItemService } from '../media-item/media-item.service';
import { NftService } from '@nft/api-modules/nft/nft.service';
import { NftItemService } from '@nft/api-modules/nft-item/nft-item.service';
import { NftOwnerItemService } from '@nft/api-modules/nft-owner/nft-owner.service';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],

      providers: [
        {
          provide: UserService,
          useValue: mockDataServiceFactory(),
        },
        { provide: MediaItemService, useValue: mockDataServiceFactory() },
        { provide: NftService, useValue: mockDataServiceFactory() },
        { provide: NftItemService, useValue: mockDataServiceFactory() },
        { provide: NftOwnerItemService, useValue: mockDataServiceFactory() },
      ],
    }).compile();

    controller = module.get(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
