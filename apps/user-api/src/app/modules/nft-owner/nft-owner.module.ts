import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@nft/core-modules/auth/auth.module';
import { JwtStrategy } from '@nft/core-modules/auth/jwt.strategy';
import { NftOwnerItemController } from './nft-owner.controller';
import { NftOwnerItemService } from './nft-owner.service';
import { NftOwnerItem } from './entities/nft-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NftOwnerItem]), AuthModule],
  controllers: [NftOwnerItemController],
  providers: [JwtStrategy, NftOwnerItemService],
})
export class NftOwnerItemModule {}
