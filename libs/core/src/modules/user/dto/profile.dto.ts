import { ApiObjectId, ApiString } from '@nft/shared';
import { ApiProperty } from '@nestjs/swagger';
import { API_ROLES } from '@nft/core-lib';
import { ApiRolesType } from '../../../lib/types/roles.type';

class ProfileNftOwnerItem {
  @ApiString()
  createdAt: string;

  @ApiString()
  authorImage;

  @ApiString()
  authorName;

  @ApiString()
  author: string;

  @ApiObjectId()
  authorId: string;

  @ApiString()
  imageSrc: string;

  @ApiObjectId()
  nftId;

  @ApiObjectId()
  nftOwnerId: string;

  @ApiProperty({ type: 'boolean' })
  read: boolean;

  @ApiString()
  title: string;
}

export class AuthorProfileDto {
  @ApiObjectId()
  authorId: string;

  @ApiString()
  authorName;

  @ApiString()
  authorUsername: string;

  @ApiString()
  authorImage;
}

export class ProfileDto {
  @ApiString()
  _id: string;

  @ApiString()
  createdBy: string;

  @ApiString()
  imageSrc: string;

  @ApiString()
  firstName: string;

  @ApiString()
  lastName: string;

  @ApiString()
  email: string;

  @ApiProperty({ enum: API_ROLES, name: 'role', enumName: 'ApiRolesType' })
  role: ApiRolesType;

  @ApiString()
  phoneNumber: string;

  @ApiString()
  isDisabled: boolean;

  @ApiString()
  username: string;

  @ApiProperty({ type: () => ProfileNftOwnerItem, isArray: true })
  sharedItems: ProfileNftOwnerItem;

  @ApiProperty({ type: Number })
  sharedCount: number;

  @ApiProperty({ type: Number })
  sharesCount: number;

  @ApiProperty({ type: Number })
  likesCount: number;

  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  transactionDate: string;

  @ApiProperty()
  transactionEndDate: string;
}
