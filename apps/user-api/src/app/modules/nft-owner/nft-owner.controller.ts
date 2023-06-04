import { JwtAuthGuard } from '@nft/core-modules/auth/guards/jwt-auth.guard';
import { Controller, Param, HttpCode, UseGuards, HttpStatus, Get, Delete, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectId } from '@nft/core-lib';
import { ObjectIdPipe } from '@nft/shared';
import RouteTokens from '@nft/user-api-core/constants/open-api.constants';
import { GetUserId } from '@nft/user-api-core/decorators/user.decorator';
import { NftOwnerItemService } from './nft-owner.service';
import { NftOwnerItemsByUserIdDto, NftOwnerItemsDto, NftOwnerItemsResponseDto } from './dto/nft-owner.dto';
import { NftOwnerItemGetResponse } from './nft-owner.decorator';
import { NftOwnerItem } from './entities/nft-owner.entity';
import { MediaItemResponseDto } from '@nft/api-modules/media-item/dto/media-item-response.dto';
import { NftResponseDto } from '@nft/api-modules/nft/dto/nft-response.dto';
import { UserGuard } from '@nft/core-modules/user/user.guard';

@ApiTags('share-items')
@Controller('share-items')
export class NftOwnerItemController {
  constructor(private readonly nftOwnerService: NftOwnerItemService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('shared-by-user')
  @NftOwnerItemGetResponse({ type: NftOwnerItemsResponseDto, isArray: true })
  async findItemsNftOwnerdByUser(@GetUserId() userId: string) {
    return await this.nftOwnerService.getItemsNftOwnerdByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('shared-by-user/media-items')
  @NftOwnerItemGetResponse({ type: MediaItemResponseDto, isArray: true })
  async findMediaItemsNftOwnerdByUser(@GetUserId() userId: string) {
    return await this.nftOwnerService.getMediaItemsNftOwnerdByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('shared-by-user/nfts')
  @NftOwnerItemGetResponse({ type: NftResponseDto, isArray: true })
  async findNftsNftOwnerdByUser(@GetUserId() userId: string) {
    return await this.nftOwnerService.getNftsNftOwnerdByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('shared-with-user')
  @NftOwnerItemGetResponse({ type: NftOwnerItemsResponseDto, isArray: false })
  async findItemsNftOwnerdWithUser(@GetUserId() userId: string) {
    return await this.nftOwnerService.getItemsNftOwnerdWithUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('shared-with-user/media-items')
  @NftOwnerItemGetResponse({ type: MediaItemResponseDto, isArray: true })
  async findMediaItemsNftOwnerdWithUser(@GetUserId() userId: string) {
    return await this.nftOwnerService.getMediaItemsNftOwnerdWithUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('shared-with-user/nfts')
  @NftOwnerItemGetResponse({ type: NftResponseDto, isArray: true })
  async findNftsNftOwnerdWithUser(@GetUserId() userId: string) {
    return await this.nftOwnerService.getNftsNftOwnerdWithUser(userId);
  }

  @Get(RouteTokens.user_idARE_ID)
  @ApiParam({ name: 'nftOwnerId', type: String, required: true })
  @NftOwnerItemGetResponse()
  async findNftOwnerItem(@Param('nftOwnerId', new ObjectIdPipe()) nftOwnerId: ObjectId) {
    return await this.nftOwnerService.findOne(nftOwnerId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Post(`read/${RouteTokens.nft_owner_id}`) // TODO: Why is this a POST? Shouldn't we be using NftOwnerItemPostResponse as well?
  @ApiParam({ name: 'nftOwnerId', type: String, required: true })
  @ApiResponse({ type: NftOwnerItem, status: 200 })
  async readNftOwnerItem(@Param('nftOwnerId', new ObjectIdPipe()) nftOwnerId: ObjectId) {
    return await this.nftOwnerService.update(nftOwnerId, { read: true });
  }

  @Delete(RouteTokens.nft_owner_id)
  @ApiParam({ name: 'nftOwnerId', type: String, required: true })
  @NftOwnerItemGetResponse()
  async removeNftOwnerItem(@Param('nftOwnerId', new ObjectIdPipe()) nftOwnerId: ObjectId) {
    return await this.nftOwnerService.remove(nftOwnerId);
  }

  @Post('unshare-all-items')
  @ApiBody({ type: () => NftOwnerItemsDto })
  async removeAllNftOwnerItems(@Body() nftOwnersDto: NftOwnerItemsDto) {
    await this.nftOwnerService.removeNftOwnerItems(nftOwnersDto.nftOwnerIds);
  }

  @Post('unshare-all-by-user-id')
  @ApiBody({ type: () => NftOwnerItemsByUserIdDto })
  async removeNftOwnerItemAllByUserId(@Body() nftOwnersByUserIdDto: NftOwnerItemsByUserIdDto) {
    await this.nftOwnerService.removeUserConnectionNftOwnerItems(nftOwnersByUserIdDto.nftOwnerByUserIds);
  }
}
