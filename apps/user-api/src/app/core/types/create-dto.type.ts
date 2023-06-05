import { ApiBaseEntity } from '@nft/user-api-core/entities/base.entity';

export type CreateDtoType<E extends ApiBaseEntity<E>> = Omit<
  E,
  '_id' | 'factory'
>;
