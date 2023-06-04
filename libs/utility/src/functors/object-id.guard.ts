import { IdType, ObjectId } from '../types';
const ObjectIdGuard = function (value: IdType): ObjectId {
  return typeof value === 'string' ? new ObjectId(value) : value;
};

const StringIdGuard = function (value: IdType): string {
  return typeof value === 'string' ? value : value.toHexString();
};

export { ObjectIdGuard, StringIdGuard };
