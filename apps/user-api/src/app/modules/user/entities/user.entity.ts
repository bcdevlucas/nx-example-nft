import { ObjectType, Field } from '@nestjs/graphql';
import { Nft } from '../../nft/entities/nft.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => String, { description: 'User ID' })
  id: string;

  @Column()
  @Field(() => String, { description: 'First Name' })
  firstName: string;

  @Column()
  @Field(() => String, { description: 'Last Name' })
  lastName: string;

  @Column()
  @Field(() => String, { description: 'User Email' })
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { description: 'User Role' })
  role: string;

  @Column({ nullable: true })
  @Field(() => String, { description: 'Password' })
  password: string;

  @CreateDateColumn()
  @Field(() => String, { description: 'Created Date' })
  createdDate: string;

  @UpdateDateColumn()
  @Field(() => String, { description: 'Updated Date' })
  updatedDate: string;

  @OneToMany(() => Nft, (nft) => nft.owner)
  nfts?: Nft[];

  @OneToMany(() => Transaction, (tx) => tx.transferredBy)
  transactionsOutbound: Transaction[];

  @OneToMany(() => Transaction, (tx) => tx.transferredTo)
  transactionsInbound: Transaction[];
}
