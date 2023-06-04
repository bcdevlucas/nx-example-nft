import { SesModule, SesService } from '@nft/api-modules/nestjs-ses';
import { SesModuleOptions } from '@nft/api-modules/nestjs-ses/ses.struct';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.provider';
import { NftService } from '@nft/api-modules/nft/nft.service';
import { Nft } from '@nft/api-modules/nft/entities/nft.entity';
import { NftItemService } from '@nft/api-modules/nft-item/nft-item.service';
import { NftItem } from '@nft/api-modules/nft-item/entities/nft-item.entity';
import { MediaItemService } from '@nft/api-modules/media-item/media-item.service';
import { MediaItem } from '@nft/api-modules/media-item/entities/media-item.entity';
import { NftOwnerItemModule } from '@nft/api-modules/nft-owner/nft-owner.module';
import { JwtDecodeMiddleware } from '@nft/user-api-core/../../lib/middleware/jwt-decode.middleware';
import { UsersController } from './users.controller';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserConnection } from '@nft/api-modules/user-connection/entities/user-connection.entity';
import { UserConnectionService } from '@nft/api-modules/user-connection/user-connection.service';

@Module({
  imports: [
    SesModule.registerAsync([
      {
        imports: [AppConfigModule],
        inject: [AppConfigService],
        useFactory: (configService: AppConfigService) => {
          const sesConfig: SesModuleOptions = {
            region: configService.get('sesModuleRegion'),
            akiKey: configService.get('sesModuleAkiKey'),
            secret: configService.get('sesModuleSecret'),
          };

          console.log(`[UserModule.registerAsync useFactory] ${JSON.stringify(sesConfig, null, 2)}`);
          return sesConfig;
        },
      },
    ]),
    AuthModule,
    TypeOrmModule.forFeature([User, UserConnection, Nft, NftItem, MediaItem]),
    NftOwnerItemModule,
    AppConfigModule,
  ],
  controllers: [UserController, UsersController],
  providers: [NftService, NftItemService, MediaItemService, UserConnectionService, AppConfigService, SesService],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecodeMiddleware).forRoutes(UsersController);
  }
}
