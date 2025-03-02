import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { entities } from './entities';




config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  url: configService.get<string>('DATABASE_URL'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  ssl: {
    rejectUnauthorized: false, // Disable SSL verification
  },
  entities,
  logging: true,
  migrations: ['./migrations/*.ts'],
});
