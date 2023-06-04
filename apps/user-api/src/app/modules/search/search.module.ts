import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '@nft/core-modules/app-config/app-config.module';
import { AuthModule } from '@nft/core-modules/auth/auth.module';
import { SearchController } from './search.controller';
import { Nft } from '@nft/api-modules/nft/entities/nft.entity';
import { NftService } from '@nft/api-modules/nft/nft.service';
import { NftOwnerItemModule } from '@nft/api-modules/nft-owner/nft-owner.module';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([Nft]), NftOwnerItemModule, AuthModule],
  controllers: [SearchController],
  providers: [NftService],
})
export class SearchModule {}
