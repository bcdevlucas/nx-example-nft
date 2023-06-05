import { CreateTransactionInput } from './create-transaction.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput extends PartialType(CreateTransactionInput) {
  @Field(() => String)
  id: string;
}
