import { Controller, Body, Param, UseGuards, Query, Get, Post, Put, Delete, Res, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ObjectIdGuard } from '@nft/utility';
import { Response } from 'express';
import { ObjectId } from '@nft/core-lib';
import { ObjectIdPipe } from '@nft/shared';
import RouteTokens from '@nft/user-api-core/constants/open-api.constants';
import { NFT_VISIBILITY } from '@nft/core-lib';
import { CreateDto } from '@nft/user-api-core/decorators/create-dto.decorator';
import { GetUserId } from '@nft/user-api-core/decorators/user.decorator';
import { UserService } from '@nft/core-modules/user/user.service';
import { UserGuard } from '@nft/core-modules/user/user.guard';
import { JwtAuthGuard } from '@nft/core-modules/auth/guards/jwt-auth.guard';
import { NftGetResponse, NftPostResponse, NftPutResponse, NftNftOwnerResponse } from './nft.decorator';
import { notFoundResponse } from '@nft/core-lib/functors/http-errors.functor';
import { NftService } from './nft.service';
import { NftResponseDto } from './dto/nft-response.dto';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { NftOwnerItemService } from '@nft/api-modules/nft-owner/nft-owner.service';
import { NftOwnerItem } from '@nft/api-modules/nft-owner/entities/nft-owner.entity';

@ApiTags('nfts')
@Controller('nfts')
export class NftController {
  constructor(private userService: UserService, private readonly nftService: NftService, private nftOwnerService: NftOwnerItemService) {}

  @Get('visibilities')
  getVisibilities() {
    return { visibilities: NFT_VISIBILITY };
  }

  @Get(RouteTokens.nft_id)
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'nftId', type: String, required: true, example: new ObjectId().toHexString() })
  @NftGetResponse()
  async findOne(@Param('nftId', new ObjectIdPipe()) nftId: ObjectId) {
    const response = await this.nftService.getById(nftId);
    if (!response) throw notFoundResponse('nft', { args: { nftId } });
    return response;
  }

  @Get()
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'text', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'tags', type: String, explode: true, isArray: true, required: false, allowEmptyValue: true })
  @NftGetResponse({ type: NftResponseDto, isArray: true })
  async findAll(@GetUserId() userId: string, @Query('text') query?: string, @Query('tags') tags?: string[]) {
    const parsedTags = Array.isArray(tags) ? tags : typeof tags === 'string' ? [tags] : undefined;
    return !!(query || tags) ? await this.nftService.search({ userId, query, tags: parsedTags }) : await this.nftService.getByUserId(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @NftPostResponse({ type: CreateNftResponseDto })
  async create(@CreateDto() createNftDto: CreateNftDto, @GetUserId() userId: string) {
    return await this.nftService.createNftWithItems({
      ...createNftDto,
      createdBy: ObjectIdGuard(userId),
      cloneOf: createNftDto?.cloneOf ? createNftDto.cloneOf : undefined,
    });
  }

  @Put(RouteTokens.nft_id)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'nftId', type: String, required: true, example: new ObjectId().toHexString() })
  @ApiBody({ type: UpdateNftDto })
  @NftPutResponse()
  async update(@Param('nftId') nftId: string, @GetUserId() userId: string, @Body() updateNftDto: UpdateNftDto) {
    return await this.nftService.updateNftWithItems(nftId, updateNftDto);
  }

  @Delete(RouteTokens.nft_id)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'nftId', type: String, required: true, example: new ObjectId().toHexString() })
  async remove(@Param('nftId') nftId: string) {
    return await this.nftService.removeNftWithItems(nftId);
  }

  @Post(`${RouteTokens.nft_id}/share/${RouteTokens.user_id}`)
  @ApiParam({ name: 'nftId', type: String, required: true })
  @ApiParam({ name: 'userId', type: String, required: true })
  @NftNftOwnerResponse({ type: NftOwnerItem, isArray: true })
  async share(
    @Param('nftId', new ObjectIdPipe()) nftId: ObjectId,
    @Param('userId', new ObjectIdPipe()) userId: ObjectId,
    @GetUserId() createdBy: string,
    @Res() response: Response
  ) {
    const nftOwner = await this.nftOwnerService.createNftNftOwnerItem({ createdBy: ObjectIdGuard(createdBy), userId, nftId, title: '' });
    return response.status(HttpStatus.CREATED).send(nftOwner);
  }
}
