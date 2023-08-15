import { Module } from '@nestjs/common'
import {AppService} from './app.service';
import {AppController} from './app.controller';
import { OrderModule } from '../order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import { InventoryModule } from '../inventory/inventory.module';
import { getMiddleConfig } from 'src/config/middleware.config';
import { WeChatAPIModule } from '../wechatAPIToken/wechatAPI.module';
import { RedisModule } from '@liaoliaots/nestjs-redis'

const {database, redisCache, redisConfig} = getMiddleConfig()
const entities = process.env.NODE_ENV === 'production' ? ['*.entity.js'] : [join(__dirname, '**', '*.entity.{ts,js}')]

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
  providers: [AppService],
  imports:[
    TypeOrmModule,
    TypeOrmModuleInstance,
    WeChatAPIModule,
    OrderModule,
    //InventoryModule,
    RedisModule.register({
      host:redisConfig.host,
      port:redisConfig.port,
      name:redisConfig.name
    }),
  ],
})

export class AppModule {}

