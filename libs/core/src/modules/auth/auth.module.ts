import { NftOwnerItemService } from '@nft/api-modules/nft-owner/nft-owner.service';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.provider';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Nft } from '@nft/api-modules/nft/entities/nft.entity';
import { NftOwnerItem } from '@nft/api-modules/nft-owner/entities/nft-owner.entity';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { accessKey } from './keys';
import { UserConnection } from '@nft/api-modules/user-connection/entities/user-connection.entity';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: 'AUTH_CLIENT',

        useFactory: (configService: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('authHost'),
            port: configService.get('authPort'),
          },
        }),
        inject: [AppConfigService],
      },
    ]),
    JwtModule.register({
      publicKey: accessKey,
      signOptions: { expiresIn: '10h' },
      verifyOptions: {
        // algorithms: ['RS256'],
        ignoreExpiration: true,
      },
    }),
    TypeOrmModule.forFeature([User, Nft, NftItem, MediaItem, NftOwnerItem, UserConnection]),
  ],
  controllers: [],
  providers: [LocalStrategy, SessionSerializer, AuthService, UserService, NftOwnerItemService],
  exports: [ClientsModule, SessionSerializer, LocalStrategy, AuthService, UserService, NftOwnerItemService, AppConfigModule],
})
export class AuthModule {}
