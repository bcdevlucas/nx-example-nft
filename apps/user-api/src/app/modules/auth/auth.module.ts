import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '@nft/core-modules/app-config/app-config.module';
import { AppConfigService } from '@nft/core-modules/app-config/app-config.provider';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Nft } from '@nft/api-modules/nft/entities/nft.entity';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { accessKey } from './keys';

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
            // TODO: Fix these!
            // host: configService.get('authHost'),
            // port: configService.get('authPort'),
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
    TypeOrmModule.forFeature([User, Nft]),
  ],
  controllers: [],
  providers: [LocalStrategy, SessionSerializer, AuthService, UserService],
  exports: [ClientsModule, SessionSerializer, LocalStrategy, AuthService, UserService, AppConfigModule],
})
export class AuthModule {}
