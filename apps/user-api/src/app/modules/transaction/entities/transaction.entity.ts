import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Transaction ID' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Timestamp' })
  timestamp: string;

  @Column()
  @Field(() => String, { description: 'NFT ID (UUID)' })
  nftId: string;

  @Column()
  @Field(() => String, { description: 'Transferred By (UUID)' })
  transferredBy: string;

  @Column()
  @Field(() => String, { description: 'Transferred To (UUID)' })
  transferredTo: string;

  @Column()
  @Field(() => String, { description: 'Transaction Status' })
  status: string;
}
