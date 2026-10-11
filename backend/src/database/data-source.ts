import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({
  path: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
  quiet: true,
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
