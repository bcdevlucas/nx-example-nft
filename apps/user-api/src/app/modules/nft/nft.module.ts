import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtDecodeMiddleware } from '@nft/core-lib/middleware/jwt-decode.middleware';
import { AppConfigModule } from '@nft/core-modules/app-config/app-config.module';
import { AppConfigService } from '@nft/core-modules/app-config/app-config.provider';
import { AuthModule } from '@nft/core-modules/auth/auth.module';
import { User } from '@nft/core-modules/user/entities/user.entity';
import { UserService } from '@nft/core-modules/user/user.service';
import { NftOwnerItemModule } from '@nft/api-modules/nft-owner/nft-owner.module';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { Nft } from './entities/nft.entity';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forFeature([User, Nft]), NftOwnerItemModule, AuthModule],
  controllers: [NftController],
  providers: [NftService, UserService, AppConfigService],
})
export class NftModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecodeMiddleware).forRoutes(NftController);
  }
}
