import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Nft {
  @PrimaryGeneratedColumn()
  @Field(() => String, { description: 'NFT ID' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Name' })
  name: string;

  @Column()
  @Field(() => String, { description: 'Blockchain Link' })
  blockchainLink: string;

  @Column()
  @Field(() => String, { description: 'Description' })
  description: string;

  @Column()
  @Field(() => String, { description: 'Image URL' })
  imageUrl: string;

  @Column({ name: 'owner', unique: false, type: 'varchar' })
  @ManyToOne(() => User, (user) => user.nfts)
  @Field(() => String, { description: 'Owner' })
  owner: User;

  @CreateDateColumn()
  @Field(() => String, { description: 'Mint Date' })
  mintDate: string;

  @UpdateDateColumn()
  @Field(() => String, { description: 'Updated Date' })
  updatedDate: string;
}
