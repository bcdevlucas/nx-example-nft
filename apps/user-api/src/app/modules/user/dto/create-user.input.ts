import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'First Name' })
  firstName: string;
  @Field(() => String, { description: 'Last Name' })
  lastName: string;
  @Field(() => String, { description: 'User Email' })
  email: string;
  @Field(() => String, { description: 'User Role' })
  role: string;
}
