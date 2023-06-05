/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@nft/core-modules/app-config/app-config.provider';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig: AppConfigService = app.get(AppConfigService);
  const isDev = appConfig.get('env')

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = appConfig.get('port') || 3000;

  /* SWAGGER */
  const config = new DocumentBuilder()
    .setTitle('NFT API')
    .setDescription('API documentation for the NFT API')
    .setVersion('0.0.0')
    .addServer(`http://localhost:${port}`, 'local dev')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document, { explorer: isDev });

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
