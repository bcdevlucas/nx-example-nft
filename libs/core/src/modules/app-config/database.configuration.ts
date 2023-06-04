import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  // useUnifiedTopology: true,
  // useNewUrlParser: true,
  type: process.env.DB_TYPE,
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true',
  autoLoadEntities: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
}));
