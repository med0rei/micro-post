import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { EnvironmentVariables } from '../config/env.validation';
import { SnakeNamingStrategy } from '../shared//strategies/snake-naming.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', { infer: true }),
        port: configService.get('DB_PORT', { infer: true }),
        username: configService.get('DB_USER', { infer: true }),
        password: configService.get('DB_PASSWORD', { infer: true }),
        database: configService.get('DB_NAME', { infer: true }),
        autoLoadEntities: true,
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class DatabaseModule {}
