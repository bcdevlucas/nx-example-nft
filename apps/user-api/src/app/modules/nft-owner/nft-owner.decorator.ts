import { ApiControllerDecoratorParams } from '@nft/shared';
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UseJwtGuard } from '@nft/core-modules/auth/auth.decorator';
import { NftOwnerItem } from './entities/nft-owner.entity';

export function NftOwnerItemGetResponse({ type = NftOwnerItem, isArray = false, description }: ApiControllerDecoratorParams = {}) {
  return applyDecorators(ApiResponse({ type, isArray, description, status: 200 }), UseJwtGuard());
}

export function NftOwnerItemPostResponse({ type = NftOwnerItem, isArray = false, description }: ApiControllerDecoratorParams = {}) {
  return applyDecorators(ApiResponse({ type, isArray, description, status: 201 }), UseJwtGuard());
}
