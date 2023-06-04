import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectIdGuard } from '@nft/utility';
import { IdType, VISIBILITY_PUBLIC, VISIBILITY_SUBSCRIPTION } from '@nft/core-lib';
import { ObjectId } from '@nft/core-lib';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from 'typeorm';
import { FilterableDataService } from '@nft/core-lib';
import { AppConfigService } from '@nft/core-modules/app-config/app-config.provider';
import { UserService } from '@nft/core-modules/user/user.service';
import { Nft } from './entities/nft.entity';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { SearchParameters } from '@nft/shared';

/* type CreateNftParameters = {
  nftId: ObjectId;
  items: string[];
  createdBy: ObjectId;
}; */

@Injectable()
export class NftService extends FilterableDataService<Nft, MongoRepository<Nft>> {
  constructor(
    @InjectRepository(Nft)
    repository: MongoRepository<Nft>,
    logger: PinoLogger,
    private configService: AppConfigService,
    private userService: UserService,
    private nftItemService: NftItemService
  ) {
    super(repository, logger);
    this.repository
      // TODO: Support weights and upgrade MongoDB, for now we're just going to remove description as we can't weight the results...
      // .createCollectionIndex({ title: 'text', description: 'text' })
      .createCollectionIndex({ title: 'text' })
      .then((indexName) => {
        this.collectionIndexName = indexName;
      });
  }

  async createNftWithItems(dto: CreateNftDto & { createdBy: ObjectId }) {
    const { title, visibility, description, imageSrc, mediaIds, tags, createdBy, cloneOf } = dto;
    return await this.create({
      title,
      visibility,
      description,
      imageSrc,
      tags,
      createdBy: ObjectIdGuard(createdBy),
      mediaIds: mediaIds.map((id) => new ObjectId(id)),
      cloneOf,
    });
  }

  async updateNftWithItems(nftId: IdType, dto: UpdateNftDto) {
    const { mediaIds, ...rest } = dto;
    // TODO: Transaction!
    // Get nft items by nftId
    const nftItems = await this.nftItemService.findAllByQuery({ nftId: ObjectIdGuard(nftId) } as any);
    // Filter out any deleted media items
    const nftItemIdsToDelete = nftItems
      // If nft item mediaId is NOT included in our mediaIds, delete the nft item
      .filter((item: NftItem) => !mediaIds.includes(item.mediaId.toString()))
      .map((item: NftItem) => item._id.toString());

    // Ensure unique ids
    const uniqueNftItemIdsToDelete = Array.from(new Set(nftItemIdsToDelete));
    const deleteNftItems = uniqueNftItemIdsToDelete.map(async (nftItemId) => await this.nftItemService.remove(nftItemId));

    const result = await Promise.all(deleteNftItems);
    if (!result) {
      // Handle error
    }

    return await this.update(nftId, {
      ...rest,
      mediaIds: mediaIds.length > 0 ? mediaIds.map((id) => ObjectIdGuard(id)) : [],
    });
  }

  async removeNftWithItems(nftId: IdType) {
    // Get nft items by nftId
    const nftItems = await this.nftItemService.findAllByQuery({ nftId: ObjectIdGuard(nftId) } as any);
    const nftItemIdsToDelete = nftItems.map((item: NftItem) => item._id.toString());
    const deleteNftItems = nftItemIdsToDelete.map(async (nftItemId) => await this.nftItemService.remove(nftItemId));

    const result = await Promise.all(deleteNftItems);
    if (!result) {
      // Handle error
    }

    return await this.remove(nftId);
  }

  /* private async createNftItems({ nftId, items, createdBy }: CreateNftParameters) {
    if (!nftId || typeof nftId === 'string') throw new Error('wrong type in createNftItems.id');
    const mappedItems = items.map((item) => ({ item, nftId, createdBy }));
    return await this.nftItemService.insertMany(mappedItems);
  }

  private async updateNftItems({ nftId, items, createdBy }: CreateNftParameters) {
    if (!nftId || typeof nftId === 'string') throw new Error('wrong type in createNftItems.id');
    const mappedItems = items.map((item) => ({ item, nftId, createdBy }));
    return await this.playlistItemService.insertMany(mappedItems);
  } */

  protected buildAggregateQuery({
    userId,
    query,
    fullText = false,
    // textMatchingMode = 'and',
    tags,
    // TODO: Complete support for tagsMatchingMode (it's not exposed via controller)
    tagsMatchingMode = 'all', // all | any // TODO: Type this!
  }: SearchParameters) {
    let aggregateQuery = [];

    // We have to search by text first as $match->$text is only allowed to be the first part of an aggregate query
    // TODO: fullText means a search on all index fields, this is only supported in MongoDB Atlas
    // Not sure if we want to use Atlas as we can't self host... we can implement distributed search later...
    if (query && fullText) {
      // IMPORTANT! This shouldn't run at any time (fullText = false is hardcoded)
      throw new Error('Elastic search has not been implemented');
    } else if (query && !fullText) {
      if (this.useDistributedSearch) {
        throw new Error('Elastic search has not been implemented');
      }
    }

    // Match by user ID if it's available as it's indexed and this is the best way to reduce the number of results early
    if (userId) {
      aggregateQuery = aggregateQuery.concat([
        {
          $match: query
            ? {
                $text: { $search: query },
                $and: [{ createdBy: ObjectIdGuard(userId) }],
              }
            : {
                $and: [{ createdBy: ObjectIdGuard(userId) }],
              },
        },
      ]);
    } else {
      // Only return search results that are app subscriber content (for paying app subscribers), shared content from a user's network, or public content
      const appSubscriberContentUserIds = this.configService.get('appSubscriberContentUserIds');
      aggregateQuery = aggregateQuery.concat([
        {
          $match: query
            ? {
                $text: { $search: query },
                $and: [
                  { $or: [...appSubscriberContentUserIds.map((id) => ({ createdBy: ObjectIdGuard(id) }))] },
                  { visibility: { $in: [VISIBILITY_PUBLIC, VISIBILITY_SUBSCRIPTION] } },
                ],
              }
            : {
                $and: [
                  { $or: [...appSubscriberContentUserIds.map((id) => ({ createdBy: ObjectIdGuard(id) }))] },
                  { visibility: { $in: [VISIBILITY_PUBLIC, VISIBILITY_SUBSCRIPTION] } },
                ],
              },
        },
      ]);
    }

    // Tags are not indexed as they're nested in the documents, so do this last!
    if (tags) {
      aggregateQuery = aggregateQuery.concat([
        {
          $addFields: {
            matchedTags: '$tags.key',
          },
        },
      ]);

      if (tagsMatchingMode === 'any') {
        aggregateQuery.push({
          $match: {
            // TODO: User tags?
            // createdBy: userId,
            matchedTags: { $in: tags },
          },
        });
      } else if (tagsMatchingMode === 'all') {
        aggregateQuery.push({
          $match: {
            // TODO: User tags?
            // createdBy: userId,
            matchedTags: { $all: tags },
          },
        });
      }
    }

    return aggregateQuery;
  }

  protected buildFields() {
    return [
      { $lookup: { from: 'user', localField: 'createdBy', foreignField: '_id', as: 'author' } },
      { $lookup: { from: 'media_item', localField: 'mediaIds', foreignField: '_id', as: 'mediaItems' } },
      { $lookup: { from: 'playlist_item', localField: '_id', foreignField: 'nftId', as: 'playlistItems' } },
      { $lookup: { from: 'share_item', localField: '_id', foreignField: 'nftId', as: 'nftOwners' } },
      { $lookup: { from: 'view_item', localField: '_id', foreignField: 'nftId', as: 'viewItems' } },
      { $lookup: { from: 'like_item', localField: '_id', foreignField: 'nftId', as: 'likeItems' } },
      { $unwind: { path: '$author' } },
      {
        $addFields: {
          authorProfile: {
            authorId: '$author._id',
            authorName: { $concat: ['$author.firstName', ' ', '$author.lastName'] },
            authorUsername: '$author.username',
            authorImage: '$author.imageSrc',
          },
        },
      },
    ];
  }

  protected replaceRoot(): object {
    return {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              _id: '$_id',
              userId: '$author._id',
              username: '$author.username',
              authorProfile: '$authorProfile',
              title: '$title',
              description: '$description',
              imageSrc: '$imageSrc',
              visibility: '$visibility',
              tags: '$tags',
              mediaItems: '$mediaItems',
              playlistItems: '$playlistItems',
              shareCount: { $size: '$nftOwners' },
              likesCount: { $size: '$likeItems' },
              viewCount: { $size: '$viewItems' },
              createdBy: '$author._id',
              createdAt: '$createdAt',
              updatedDate: '$updatedDate',
            },
          ],
        },
      },
    };
  }
}
