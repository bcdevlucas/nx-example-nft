import { Entity, Column, OneToMany } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ObjectId } from '@nft/core-lib';
import { ApiEntity } from '@nft/user-api-core/entities/base.entity';
import { ApiRolesType, API_ROLES } from '@nft/core-lib';
import { NftOwnerItem } from '@nft/api-modules/nft-owner/entities/nft-owner.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User extends ApiEntity {
  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  phoneNumber: string;

  @ApiProperty()
  @Column()
  isDisabled: boolean;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  sub: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  transactionId: string;

  @ApiProperty()
  @Column()
  transactionDate: string;

  @ApiProperty()
  @Column()
  transactionEndDate: string;

  @ApiProperty()
  @Column()
  imageSrc: string;

  /* @ApiProperty({ isArray: true, nullable: true})
  @Column({ array: true, nullable: true }) sharedNfts?: ObjectId[];

  @ApiProperty({ isArray: true, nullable: true})
  @Column({ array: true, nullable: true}) sharedMediaItems?: ObjectId[]; */

  @ApiProperty()
  @Column({ enum: API_ROLES, name: 'role', enumName: 'ApiRolesType' })
  role: ApiRolesType;

  @ApiProperty({ type: () => NftOwnerItem, isArray: true, nullable: true })
  @OneToMany(() => NftOwnerItem, (nftOwner) => nftOwner.userId)
  @Column({ array: true, nullable: true })
  nftOwner?: NftOwnerItem[];
}
