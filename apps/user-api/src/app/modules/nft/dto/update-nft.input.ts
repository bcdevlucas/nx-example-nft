import { CreateNftInput } from './create-nft.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNftInput extends PartialType(CreateNftInput) {
  @Field(() => String)
  id: string;
}
