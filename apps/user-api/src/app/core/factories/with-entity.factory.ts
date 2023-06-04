// import { DeepPartial } from '@nft/user-api-core/entities/base.entity';
import { ObjectId } from '@nft/core-lib';

import { Entity } from 'typeorm';
import { ObjectIdColumn } from 'typeorm';

type Gconstructor<T = {}> = new (...args: any[]) => T;

type BaseConstructor = Gconstructor;

export function baseEntityMixin<TBase extends BaseConstructor>(Base: TBase) {
  @Entity()
  class WithObjectId extends Base {
    @ObjectIdColumn()
    _id: ObjectId;
  }
  return WithObjectId;
}