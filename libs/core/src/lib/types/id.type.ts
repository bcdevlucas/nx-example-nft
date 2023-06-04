// We are migrating away from MongoDB, replace with https://github.com/cabinjs/bson-objectid as a temporary solution
import ObjectId from 'bson-objectid';
export { ObjectId };
export type IdType = string | ObjectId;
