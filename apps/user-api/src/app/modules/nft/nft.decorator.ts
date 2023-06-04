import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UseJwtGuard } from '@nft/core-modules/auth/auth.decorator';
import { ApiControllerDecoratorParams } from '@nft/shared';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { NftResponseDto } from './dto/nft-response.dto';
import { Nft } from './entities/nft.entity';
import { NftOwnerItem } from '@nft/api-modules/nft-owner/entities/nft-owner.entity';

export function NftGetResponse({ type = NftResponseDto, isArray = false, description }: ApiControllerDecoratorParams = {}) {
  return applyDecorators(ApiResponse({ type, isArray, description, status: 200 }), UseJwtGuard());
}

export function NftPostResponse({ type = Nft, isArray = false, description }: ApiControllerDecoratorParams = {}) {
  return applyDecorators(ApiResponse({ type, isArray, description, status: 201 }), ApiBody({ type: CreateNftDto }), UseJwtGuard());
}

export function NftPutResponse({ type = Nft, isArray = false, description }: ApiControllerDecoratorParams = {}) {
  return applyDecorators(ApiResponse({ type, isArray, description, status: 200 }), ApiBody({ type: UpdateNftDto }), UseJwtGuard());
}

export function NftNftOwnerResponse({ type = NftOwnerItem, isArray = false, description }: ApiControllerDecoratorParams = {}) {
  return applyDecorators(ApiResponse({ type, isArray, description, status: 201 }), UseJwtGuard());
}
