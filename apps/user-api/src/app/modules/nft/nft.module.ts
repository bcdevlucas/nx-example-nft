import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftResolver } from './nft.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nft])],
  providers: [NftResolver, NftService],
})
export class NftModule {}
