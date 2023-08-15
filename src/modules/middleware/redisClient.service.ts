import { Injectable } from '@nestjs/common'
import * as IORedis from 'ioredis';
@Injectable()
export class RedisClientService {
  constructor(private readonly redisService: IORedis.Redis) {}
  async getInventoryClient(): Promise<IORedis.Redis> {
    return this.redisService; // 返回已初始化的 IORedis.Redis 实例
  }
}