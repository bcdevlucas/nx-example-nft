import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateNftInput {
  @Field(() => String, { description: 'Name' })
  name: string;
  @Field(() => String, { description: 'Blockchain Link' })
  blockchainLink: string;
  @Field(() => String, { description: 'Description' })
  description: string;
  @Field(() => String, { description: 'Image URL' })
  imageUrl: string;
  @Field(() => String, { description: 'Owner' })
  owner: string;
  @Field(() => String, { description: 'Mint Date' })
  mintDate: string;
}
