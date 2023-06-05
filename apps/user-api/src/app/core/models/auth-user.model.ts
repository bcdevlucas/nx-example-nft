import { ApiRolesType } from 'libs/core/src/lib/models/roles.enum';
import { ObjectId } from '@nft/core-lib';

export interface SessionUserInterface {
  username: string;
  email: string;
  createdAt: Date;
  _id: ObjectId;
  roles: ApiRolesType[];
}
