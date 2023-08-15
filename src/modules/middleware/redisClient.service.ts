import { Injectable } from '@nestjs/common'
import { RedisService } from '@liaoliaots/nestjs-redi'
import { getMiddleConfig } from 'src/config/middleware.config'

@Injectable()
export class RedisClientService {
  constructor(private readonly redisService: RedisService) {}

  redisClientName = getMiddleConfig().redisConfig.name
  //连接配置已在app.module设置
  async getInventoryClient() {
    return await this.redisService.getClient(this.redisClientName)
  }
}