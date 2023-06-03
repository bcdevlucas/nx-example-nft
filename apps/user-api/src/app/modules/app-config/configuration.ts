import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  DB_TYPE: Joi.string().default('mysql'),
  DB_HOSTNAME: Joi.string().default('localhost'),
  DB_PORT: Joi.string().default(3306),
  DB_NAME: Joi.string().default(''),
  DB_USERNAME: Joi.string().default(''),
  DB_PASSWORD: Joi.string().default(''),
  DB_SSL: Joi.boolean().default(false),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
});

export default registerAs('app', () => ({
  NODE_ENV: process.env.APP_HOST,
}));
