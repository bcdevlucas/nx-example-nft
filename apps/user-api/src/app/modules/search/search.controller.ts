import { Controller, Query, Get } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { NftGetResponse } from './search.decorator';
import { NftService } from '@nft/api-modules/nft/nft.service';
import { NftResponseDto } from '@nft/api-modules/nft/dto/nft-response.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly nftService: NftService, private readonly mediaItemService: MediaItemService) {}

  /**
   * TODO: Type contentType!
   * When we're searching for records, we want to search through public records,
   * records shared from my network, and optionally our own records,
   * although by default we want to hide those.
   * @param target
   * @param query
   * @param tags
   */
  @Get()
  @ApiQuery({ name: 'text', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'tags', type: String, explode: true, isArray: true, required: false, allowEmptyValue: true })
  @NftGetResponse({ type: NftResponseDto, isArray: true })
  async findAll(@Query('target') target?: string, @Query('text') query?: string, @Query('tags') tags?: string[]) {
    const parsedTags = Array.isArray(tags) ? tags : typeof tags === 'string' ? [tags] : undefined;
    let results = [];
    switch (target) {
      case 'nfts':
        results = !!(query || tags)
          ? await this.nftService.search({ query, tags: parsedTags })
          : await this.nftService.findAll();
        results = results.map((result) => ({ ...result, contentType: 'nft' }))
        break;
      case 'media':
        results = !!(query || tags)
          ? await this.mediaItemService.search({ query, tags: parsedTags })
          : await this.mediaItemService.search({ query: '', tags: [] });
        results = results.map((result) => ({ ...result, contentType: 'mediaItem' }))
        break;
      default:
        results = !!(query || tags)
          ? await this.nftService.search({ query, tags: parsedTags })
          : await this.nftService.findAll();
        results = results.map((result) => ({ ...result, contentType: 'nft' }))
        break;
    }
    return results;
  }

  @Get('popular')
  @NftGetResponse({ isArray: true })
  async findPopular() {
    return await this.nftService.getPopular();
  }
}
