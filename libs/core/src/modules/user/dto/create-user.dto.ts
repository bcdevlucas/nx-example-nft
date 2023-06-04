import { ApiProperty } from '@nestjs/swagger';
import { ApiDecoratorOptions, ApiEmail, ApiName, ApiObjectId, ApiPastDate, ApiString } from '@nft/shared';
import { ObjectId } from '@nft/core-lib';
import { API_ROLES } from '@nft/core-lib';
import { ApiRolesType } from '../../../lib/types/roles.type';
// import { MediaItemResponseDto } from '@nft/api-modules/media-item/dto/media-item-response.dto';
// import { NftResponseDto } from '@nft/api-modules/nft/dto/nft-response.dto';
// import { NftOwnerItem } from '@nft/api-modules/nft-owner/entities/share-item.entity';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @ApiName(<ApiDecoratorOptions>{ required: true })
  firstName: string;

  @ApiName(<ApiDecoratorOptions>{ required: true })
  lastName: string;

  @ApiEmail(<ApiDecoratorOptions>{ required: true })
  email: string;

  @ApiName(<ApiDecoratorOptions>{ required: true })
  username: string;
}

export class UserDto implements User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  @ApiString()
  imageSrc: string;

  @ApiObjectId()
  _id: ObjectId;

  @ApiString()
  username: string;

  @ApiString()
  firstName: string;

  @ApiString()
  lastName: string;

  @ApiProperty({ enum: API_ROLES, name: 'role', enumName: 'ApiRolesType' }) role: ApiRolesType;

  @ApiString()
  email: string;

  @ApiString()
  sub: string;

  @ApiString()
  createdBy?: Readonly<ObjectId>;

  @ApiString()
  userId?: ObjectId;

  @ApiString()
  phoneNumber: string;

  @ApiString()
  isDisabled: boolean;

  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  transactionDate: string;

  @ApiProperty()
  transactionEndDate: string;

  // TODO: Remove these from the API complete
  /* @ApiProperty({ type: () => MediaItemResponseDto, isArray: true })
  mediaItems?: MediaItemResponseDto[];

  @ApiProperty({ type: () => NftResponseDto, isArray: true })
  nfts?: NftResponseDto[];

  @ApiProperty()
  sharedNfts?: ObjectId[];

  @ApiProperty()
  sharedMediaItems?: ObjectId[];

  @ApiProperty()
  nftOwner: NftOwnerItem[]; */

  @ApiPastDate()
  createdAt?: Date;

  @ApiPastDate()
  updatedDate?: Date;
}
