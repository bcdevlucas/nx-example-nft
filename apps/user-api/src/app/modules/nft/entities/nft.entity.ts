import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Nft {
  @PrimaryGeneratedColumn('uuid')
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

  @Column()
  @Field(() => String, { description: 'Owner' })
  owner: string;

  @Column()
  @Field(() => String, { description: 'Mint Date' })
  mintDate: string;
}
