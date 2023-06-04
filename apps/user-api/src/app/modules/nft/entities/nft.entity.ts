import { ApiProperty } from '@nestjs/swagger';
import { ApiObjectId, ApiString, ApiTextString } from '@nft/shared';
import { Column, Entity, Index } from 'typeorm';
import { ObjectId } from '@nft/core-lib';
import { ApiEntity } from '@nft/user-api-core/entities/base.entity';
import { NftVisibilityType, NftInterface, NFT_VISIBILITY } from '@nft/core-lib';

@Entity('nft')
export class Nft extends ApiEntity implements NftInterface {
  @ApiObjectId()
  @Column({ nullable: true })
  @Index('cloneOf', { unique: false })
  cloneOf?: ObjectId;

  @Column({ nullable: true, type: 'text' })
  @ApiString()
  title: string;

  @Column({ nullable: true, type: 'text' })
  @ApiTextString()
  description: string;

  @Column({ nullable: true })
  @ApiString()
  imageSrc?: string;

  @Column({ nullable: true })
  @ApiProperty({ enum: NFT_VISIBILITY, name: 'visibility', enumName: 'NftVisibilityType', required: false })
  visibility: NftVisibilityType;
}
