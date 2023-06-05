import { Module } from '@nestjs/common';
// import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { PassportModule } from '@nestjs/passport';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AppConfigModule } from '@nft/core-modules/app-config/app-config.module';
import { AppConfigService } from '@nft/core-modules/app-config/app-config.provider';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { NftModule } from './modules/nft/nft.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    AuthModule,
    AppConfigModule,
    // GraphQLModule.forRoot<MercuriusDriverConfig>({
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // driver: MercuriusDriver,
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      playground: true,
      autoSchemaFile: './schema.gql'
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        entities: configService.db('entities'),
        synchronize: configService.db('synchronize'),
        type: configService.db('type'),
        host: configService.db('host'),
        port: configService.db('port'),
        database: configService.db('database'),
        username: configService.db('username'),
        password: configService.db('password'),
        ssl: configService.db('ssl'),
        autoLoadEntities: true,
      }),
      inject: [AppConfigService],
    }),
    /* LoggerModule.forRoot({
      pinoHttp: {
        prettyPrint: {
          colorize: true,
          levelFirst: true,
          translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
        },
      },
    }), */
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UserModule,
    NftModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {
  constructor(private appConfigService: AppConfigService) {
  }
}
