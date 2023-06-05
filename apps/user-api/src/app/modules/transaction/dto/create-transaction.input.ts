import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => String, { description: 'NFT ID (UUID)' })
  nftId: string;
  @Field(() => String, { description: 'Transferred By (UUID)' })
  transferredBy: string;
  @Field(() => String, { description: 'Transferred To (UUID)' })
  transferredTo: string;
  @Field(() => String, { description: 'Status' })
  status: string;
}
