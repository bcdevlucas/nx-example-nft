import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { ApiDecoratorOptions, ApiObjectId, ApiString } from '@nft/shared';
import { IsBoolean } from 'class-validator';
import { ObjectId } from '@nft/core-lib';
import { ApiEntity } from '@nft/user-api-core/entities/base.entity';
import { User } from '@nft/core-modules/user/entities/user.entity';

@Entity('nft_owner')
export class NftOwner extends ApiEntity {
  @ApiObjectId(<ApiDecoratorOptions>{ readOnly: true })
  @Column({ name: 'userId' })
  @Index('userId', { unique: false })
  userId: ObjectId;

  @ApiObjectId(<ApiDecoratorOptions>{ required: false })
  @Column('nftId')
  @Index('nftId', { unique: false })
  nftId: ObjectId;

  @IsBoolean()
  @Column({ name: 'read', unique: false })
  read: boolean;

  @ApiString()
  @Column({ name: 'title', unique: false })
  title: string;

  @ManyToOne(() => User, (user) => user.nftOwner)
  @Column({ name: 'owner', unique: false })
  owner: User;
}
