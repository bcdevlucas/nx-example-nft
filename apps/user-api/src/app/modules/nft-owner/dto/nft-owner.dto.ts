import { AuthorProfileDto } from '@nft/core-modules/user/dto/profile.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NftResponseDto } from '@nft/api-modules/nft/dto/nft-response.dto';

export class NftOwnerResponseDto extends NftResponseDto {
  @ApiProperty({ type: 'string' })
  nftOwnerId?: string;

  @ApiProperty({ type: 'string' })
  nftId?: string;
}

export class NftOwnerItemsResponseDto {
  @ApiProperty({ name: 'nfts', type: () => NftOwnerResponseDto })
  nfts: NftOwnerResponseDto[];
}

export class NftOwnerItemsDto {
  @ApiProperty({ name: 'nftOwnerIds', type: () => String, isArray: true })
  nftOwnerIds: string[];
}
