import { IdType } from '@nft/core-lib';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataService } from '@nft/core-lib';
import { ObjectIdGuard } from '@nft/utility';
import { PinoLogger } from 'nestjs-pino';
import { DeleteWriteOpResultObject, MongoRepository } from 'typeorm';
import { CreateMediaNftOwnerItemDto, CreateNftNftOwnerItemDto } from './dto/create-nft-owner.dto';
import { NftOwnerItem } from './entities/nft-owner.entity';

@Injectable()
export class NftOwnerItemService extends DataService<NftOwnerItem, MongoRepository<NftOwnerItem>> {
  constructor(
    @InjectRepository(NftOwnerItem)
    repository: MongoRepository<NftOwnerItem>,
    logger: PinoLogger
  ) {
    super(repository, logger);
  }

  async createMediaNftOwnerItem({ userId, mediaId, createdBy, title }: CreateMediaNftOwnerItemDto): Promise<NftOwnerItem> {
    return await this.create({
      userId: ObjectIdGuard(userId),
      mediaId: ObjectIdGuard(mediaId),
      createdBy: ObjectIdGuard(createdBy),
      title,
      read: false,
    });
  }

  async createNftNftOwnerItem({ userId, nftId, createdBy, title }: CreateNftNftOwnerItemDto): Promise<NftOwnerItem> {
    return await this.create({
      userId: ObjectIdGuard(userId),
      nftId: ObjectIdGuard(nftId),
      createdBy: ObjectIdGuard(createdBy),
      title,
      read: false,
    });
  }

  async getItemsNftOwnerdByUser(userId: IdType) {
    return {
      mediaItems: await this.getMediaItemsNftOwnerdByUser(userId),
      nfts: await this.getNftsNftOwnerdByUser(userId),
    };
  }

  async getMediaItemsNftOwnerdByUser(userId: IdType) {
    return this.repository
      .aggregate([
        { $match: { $and: [{ createdBy: ObjectIdGuard(userId) }, { mediaId: { $exists: true } }] } },
        { $lookup: { from: 'user', localField: 'createdBy', foreignField: '_id', as: 'author' } },
        { $lookup: { from: 'media_item', localField: 'mediaId', foreignField: '_id', as: 'mediaItem' } },
        { $unwind: { path: '$author' } },
        { $unwind: { path: '$mediaItem' } },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  userId: 0,
                  nftId: 0,
                  mediaId: 0,
                },
                '$mediaItem',
                {
                  createdBy: '$author',
                },
              ],
            },
          },
        },
      ])
      .toArray();
  }

  async getNftsNftOwnerdByUser(userId: IdType) {
    return this.repository
      .aggregate([
        { $match: { $and: [{ createdBy: ObjectIdGuard(userId) }, { nftId: { $exists: true } }] } },
        { $lookup: { from: 'nft', localField: 'nftId', foreignField: '_id', as: 'nft' } },
        { $lookup: { from: 'media_item', localField: 'mediaIds', foreignField: '_id', as: 'mediaItems' } },
        { $lookup: { from: 'user', localField: 'createdBy', foreignField: '_id', as: 'sharedBy' } },
        { $lookup: { from: 'user', localField: 'userId', foreignField: '_id', as: 'sharedWith' } },
        { $lookup: { from: 'user', localField: 'nft.createdBy', foreignField: '_id', as: 'author' } },
        { $lookup: { from: 'share_item', localField: 'nft._id', foreignField: 'nftId', as: 'nftOwners' } },
        { $lookup: { from: 'view_item', localField: 'nft._id', foreignField: 'nftId', as: 'viewItems' } },
        { $lookup: { from: 'like_item', localField: 'nft._id', foreignField: 'nftId', as: 'likeItems' } },
        { $unwind: '$nft' },
        { $unwind: '$sharedBy' },
        { $unwind: '$sharedWith' },
        { $unwind: '$author' },
        {
          $addFields: {
            tags: '$nft.tags',
            authorProfile: {
              authorId: '$author._id',
              authorName: { $concat: ['$author.firstName', ' ', '$author.lastName'] },
              authorUsername: '$author.username',
              authorImage: '$author.imageSrc',
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  nftId: '$nftId',
                  nftOwnerId: '$_id',
                  sharedWith: '$sharedWith.username',
                  sharedWithUserId: '$sharedWith._id',
                  sharedBy: '$sharedBy.username',
                  sharedByUserId: '$sharedBy._id',
                  authorProfile: '$authorProfile',
                  read: '$read',
                  tags: '$tags',
                  shareCount: { $size: '$nftOwners' },
                  likesCount: { $size: '$likeItems' },
                  viewCount: { $size: '$viewItems' },
                  createdAt: '$createdAt',
                },
                '$nft',
              ],
            },
          },
        },
      ])
      .toArray();
  }

  async getItemsNftOwnerdWithUser(userId: IdType) {
    return {
      mediaItems: await this.getMediaItemsNftOwnerdWithUser(userId),
      nfts: await this.getNftsNftOwnerdWithUser(userId),
    };
  }

  async getMediaItemsNftOwnerdWithUser(userId: IdType) {
    return this.repository
      .aggregate([
        { $match: { $and: [{ userId: ObjectIdGuard(userId) }, { mediaId: { $exists: true } }] } },
        { $lookup: { from: 'user', localField: 'createdBy', foreignField: '_id', as: 'author' } },
        { $lookup: { from: 'media_item', localField: 'mediaId', foreignField: '_id', as: 'mediaItem' } },
        { $unwind: { path: '$author' } },
        { $unwind: { path: '$mediaItem' } },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  userId: 0,
                  nftId: 0,
                  mediaId: 0,
                },
                '$mediaItem',
                {
                  createdBy: '$author',
                },
              ],
            },
          },
        },
      ])
      .toArray();
  }

  async getNftsNftOwnerdWithUser(userId: IdType) {
    return this.repository
      .aggregate([
        { $match: { $and: [{ userId: ObjectIdGuard(userId) }, { nftId: { $exists: true } }] } },
        { $lookup: { from: 'nft', localField: 'nftId', foreignField: '_id', as: 'nft' } },
        { $lookup: { from: 'media_item', localField: 'mediaIds', foreignField: '_id', as: 'mediaItems' } },
        { $lookup: { from: 'user', localField: 'createdBy', foreignField: '_id', as: 'sharedBy' } },
        { $lookup: { from: 'user', localField: 'userId', foreignField: '_id', as: 'sharedWith' } },
        { $lookup: { from: 'user', localField: 'nft.createdBy', foreignField: '_id', as: 'author' } },
        { $lookup: { from: 'share_item', localField: 'nft._id', foreignField: 'nftId', as: 'nftOwners' } },
        { $lookup: { from: 'view_item', localField: 'nft._id', foreignField: 'nftId', as: 'viewItems' } },
        { $lookup: { from: 'like_item', localField: 'nft._id', foreignField: 'nftId', as: 'likeItems' } },
        { $unwind: '$nft' },
        { $unwind: '$sharedBy' },
        { $unwind: '$sharedWith' },
        { $unwind: '$author' },
        {
          $addFields: {
            tags: '$nft.tags',
            authorProfile: {
              authorId: '$author._id',
              authorName: { $concat: ['$author.firstName', ' ', '$author.lastName'] },
              authorUsername: '$author.username',
              authorImage: '$author.imageSrc',
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  nftId: '$nftId',
                  nftOwnerId: '$_id',
                  sharedWith: '$sharedWith.username',
                  sharedWithUserId: '$sharedWith._id',
                  sharedBy: '$sharedBy.username',
                  sharedByUserId: '$sharedBy._id',
                  authorProfile: '$authorProfile',
                  read: '$read',
                  tags: '$tags',
                  shareCount: { $size: '$nftOwners' },
                  likesCount: { $size: '$likeItems' },
                  viewCount: { $size: '$viewItems' },
                  createdAt: '$createdAt',
                },
                '$nft',
              ],
            },
          },
        },
      ])
      .toArray();
  }

  async removeNftOwnerItems(nftOwnerIds: IdType[]): Promise<DeleteWriteOpResultObject> {
    const nftOwnerObjectIds = nftOwnerIds.map((id: string) => ObjectIdGuard(id));
    return await this.repository.deleteMany({
      _id: { $in: nftOwnerObjectIds },
    });
  }

  async removeUserConnectionNftOwnerItems(userConnectionDtos: UserConnectionDto[]): Promise<NftOwnerItem[]> {
    try {
      const nftOwnersToRemove = [];
      const removeNftOwnerItems = userConnectionDtos.map(async (userConnectionDto) => {
        const { userId, connectionId }: Partial<UserConnectionDto> = userConnectionDto;
        if (!userId || !connectionId) {
          throw new Error('userId and connectionId are both required parameters');
        }

        const query = [
          {
            $match: {
              $or: [
                {
                  $and: [{ createdBy: ObjectIdGuard(userId) }, { userId: ObjectIdGuard(connectionId) }],
                },
                {
                  $and: [{ createdBy: ObjectIdGuard(connectionId) }, { userId: ObjectIdGuard(userId) }],
                },
              ],
            },
          },
        ];
        const nftOwners = await this.repository.aggregate(query).toArray();
        nftOwnersToRemove.push(...nftOwners);
      });
      await Promise.all(removeNftOwnerItems);
      return await this.repository.remove(nftOwnersToRemove);
    } catch (error) {
      this.logger.error(`${this.constructor.name}.removeUserConnection ${error}`);
      throw error;
    }
  }
}
