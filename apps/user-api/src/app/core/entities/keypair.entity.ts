import { ApiBaseEntity } from '../entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class KeyPair<T> extends ApiBaseEntity<T> {
  @Column('key') key: string;
  @Column() value: T;
}
