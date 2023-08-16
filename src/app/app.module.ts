import { Module } from '@nestjs/common'
import {AppService} from './app.service';
import {AppController} from './app.controller';
import { OrderModule } from '../modules/order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm'
// import { join } from 'path'
import { InventoryModule } from '../modules/inventory/inventory.module';
import { getMiddleConfig } from 'src/config/middleware.config';
import { WeChatAPIModule } from '../modules/wechatAPIToken/wechatAPI.module';
import { RedisClientService } from '../modules/middleware/redisClient.service';
import { InventoryService } from '../modules/inventory/inventory.service';
import { OrderService } from '../modules/order/order.service';
import { RedisModule } from '@nestjs-modules/ioredis';

const {database, redisCache, redisConfig} = getMiddleConfig()

const TypeOrmModuleInstance = TypeOrmModule.forRoot({
  type: 'mysql',
  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.database,
  entities: [],
  synchronize: true,
  autoLoadEntities: true,
  retryAttempts: 3,
  cache: {
    type: 'redis',
    options: {
      host: redisCache.host,
      port: redisCache.port,
    },
    duration: redisCache.duration,
  },
})

@Module({
  controllers: [AppController],
  providers: [AppService, RedisClientService],
  imports:[
    //OrderModule,
    //TypeOrmModule,
    //TypeOrmModuleInstance,
    WeChatAPIModule,
    // RedisModule.forRoot({
    //   config: { 
    //     url: redisConfig.url,
    //   },
    // }),
    //InventoryModule,
  ],
})

export class AppModule {}

