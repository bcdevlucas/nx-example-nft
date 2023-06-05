import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
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
}
