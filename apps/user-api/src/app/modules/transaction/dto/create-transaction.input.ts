import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => String, { description: 'Transaction Date' })
  timestamp: string;
  @Field(() => String, { description: 'NFT ID (UUID)' })
  nftId: string;
  @Field(() => String, { description: 'Transferred By (UUID)' })
  transferredBy: string;
  @Field(() => String, { description: 'Transferred To (UUID)' })
  transferredTo: string;
}
