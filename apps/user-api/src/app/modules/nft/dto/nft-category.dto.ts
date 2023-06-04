import { ApiArray, ApiDecoratorOptions } from '@nft/shared';
import { NftVisibilityType } from '@nft/core-lib';

export class NftVisibilityDto {
  @ApiArray(<ApiDecoratorOptions>{ type: Array })
  visibilities: NftVisibilityType[];
}
