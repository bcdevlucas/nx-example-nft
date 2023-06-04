import * as Faker from 'faker';
import { ObjectId } from '@nft/core-lib';
import { CreateUserDto } from '@nft/core-modules/user/dto/create-user.dto';
import { User } from '@nft/core-modules/user/entities/user.entity';

import { range } from 'remeda';
import { Nft } from '@nft/api-modules/nft/entities/nft.entity';
import { SessionUserInterface } from '../models/auth-user.model';

import { ObjectIdGuard } from '@nft/utility';

class DataFn {
  static id = () => new ObjectId();
  static shortString = Faker.lorem.sentence;
  static longString = Faker.lorem.lines;
  static key = Faker.random.word;
  static value = Faker.random.word;
  static bool = Faker.random.boolean;
  static title = Faker.random.word;
  static number = (num: number) => Faker.random.number(num);
}
type Gconstructor<T = {}> = new (...args: any[]) => T;

type BaseConstructor = Gconstructor;

function baseEntityMixin<TBase extends BaseConstructor>(Base: TBase) {
  class WithObjectId extends Base {
    _id: ObjectId = new ObjectId();
  }
  return WithObjectId;
}

interface ConcreteNftFactory {
  createUserDto(): CreateUserDto;
}

export class UserFactory extends DataFn {
  user: User;
  get userId() {
    return this.user._id.toHexString();
  }

  createSessionUser(): SessionUserInterface {
    const { username, _id: idObject } = this.user;

    const _id = idObject.toHexString();
    const email = username;
    return {
      username,
      _id: ObjectIdGuard(_id),
      createdAt: new Date(),
      email,
      roles: ['subscriber'],
    };
  }

  constructor(id?: string) {
    super();
    const userMixin = baseEntityMixin(User);
    this.user = new userMixin();
    if (id) {
      const _id = new ObjectId(id);
      this.user._id = _id;
    }
  }

  createNftDto() {
    return {
      userId: this.user._id,
      title: DataFn.title(),
    };
  }

  createNft() {
    const nftMixin = baseEntityMixin(Nft);
    return new nftMixin();
  }
}

export function userDataFactory(userFactory: UserFactory) {
  const user = userFactory.user;

  const nftDto = range(1, DataFn.number(4)).map(() => userFactory.createNftDto());

  return { nftDto, user };
}
``;
