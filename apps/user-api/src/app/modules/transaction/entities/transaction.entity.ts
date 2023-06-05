import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  @Field(() => String, { description: 'Transaction ID' })
  id: string;

  @Column()
  @Field(() => String, { description: 'NFT ID (UUID)' })
  nftId: string;

  @Column({ name: 'transferredBy', unique: false, type: 'varchar' })
  @ManyToOne(() => User, (user) => user.transactionsOutbound)
  @Field(() => String, { description: 'Transferred By' })
  transferredBy: User;

  @Column({ name: 'transferredTo', unique: false, type: 'varchar' })
  @ManyToOne(() => User, (user) => user.transactionsInbound)
  @Field(() => String, { description: 'Transferred To' })
  transferredTo: User;

  @Column()
  @Field(() => String, { description: 'Transaction Status' })
  status: string;

  @CreateDateColumn()
  @Field(() => String, { description: 'Created Date' })
  createdDate: string;

  @UpdateDateColumn()
  @Field(() => String, { description: 'Updated Date' })
  updatedDate: string;


}
