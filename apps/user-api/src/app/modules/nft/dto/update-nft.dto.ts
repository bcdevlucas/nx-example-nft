import { ApiProperty, PickType } from '@nestjs/swagger';
import { Nft } from '../entities/nft.entity';
import { NftVisibilityType, NFT_VISIBILITY } from '@nft/core-lib';

export class UpdateNftDto extends PickType(Nft, ['title', 'visibility', 'description', '_id', 'imageSrc']) {
  @ApiProperty({ enum: NFT_VISIBILITY, name: 'visibility', enumName: 'NftVisibilityType' })
  visibility: NftVisibilityType;
}
