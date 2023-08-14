// config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import redisConfig from './redis.config';
import kafkaConfig from './kafka.config';
import appConfig from './app.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig, redisConfig, kafkaConfig],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
