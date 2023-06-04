import { Module } from '@nestjs/common';
// import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AppConfigModule } from '@nft/core-modules/app-config/app-config.module';
import { AppConfigService } from '@nft/core-modules/app-config/app-config.provider';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // AppConfigModule,
    // GraphQLModule.forRoot<MercuriusDriverConfig>({
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // driver: MercuriusDriver,
      driver: ApolloDriver,
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
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
