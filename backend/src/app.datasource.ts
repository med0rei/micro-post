import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from './shared/strategies/snake-naming.strategy';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: ['src/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});

export default AppDataSource;
