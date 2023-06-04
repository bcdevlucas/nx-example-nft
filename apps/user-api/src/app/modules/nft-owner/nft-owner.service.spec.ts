import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ObjectId } from '@nft/core-lib';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository, getMongoRepository } from 'typeorm';
import { UserFactory } from '../../core/factories/mock-data.factory';
import { mockLoggerFactory } from '../../core/factories/mock-logger.factory';
import { NftOwnerItem } from './entities/nft-owner.entity';
import { NftOwnerItemService } from './nft-owner.service';

describe('NftOwnerItemService', () => {
  let service: NftOwnerItemService;
  let repository: MongoRepository<NftOwnerItem>;

  const userFactory = new UserFactory();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          synchronize: false,
          autoLoadEntities: false,
          type: 'bson-objectid',
          url: 'mongodb://localhost:27017/',
          host: 'localhost',
          port: 27017,
          database: 'test',
          entities: [NftOwnerItem],
          ssl: false,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          logging: true,
        }),
      ],
      providers: [
        {
          provide: getRepositoryToken(NftOwnerItem),
          useClass: MongoRepository,
        },
        { provide: PinoLogger, useValue: mockLoggerFactory() },
      ],
    }).compile();

    repository = getMongoRepository(NftOwnerItem);
    await repository.deleteMany({});

    const logger = module.get(PinoLogger);
    service = new NftOwnerItemService(repository, logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMedianftOwner', () => {
    it('should insert a media share item', async () => {
      const mediaItem = userFactory.createMediaItem();

      const userId = new ObjectId();
      const mediaId = mediaItem._id;
      const createdBy = new ObjectId(userFactory.userId);

      const result = await service.createMediaNftOwnerItem({ createdBy, mediaId, userId, title: 'blah' });

      expect(result).toHaveProperty('mediaId');
      expect(result.mediaId.toHexString()).toEqual(mediaId.toHexString());
      expect(result.userId.toHexString()).toEqual(userId.toHexString());
      expect(result.createdBy.toHexString()).toEqual(createdBy.toHexString());
    });
  });

  describe('createNftNftOwnerItem', () => {
    /* it('should insert a nft share item', async () => {
      const nft = userFactory.createNft();

      const userId = new ObjectId().toHexString();

      const result = await service.createNftNftOwnerItem({
        createdBy: userFactory.userId,
        nftId: nft._id.toHexString(),
        userId,
        title: 'blah',
      });

      expect(result).toBeDefined();

      expect(result).toHaveProperty('createdBy');
      expect(result).toHaveProperty('nftId');
      expect(result.createdBy.toHexString()).toBe(userFactory.user._id.toHexString());
    }); */
  });
});
