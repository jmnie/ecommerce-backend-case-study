import { Injectable, Logger } from '@nestjs/common'
import * as kafka from 'kafka-node'
import * as Redis from 'ioredis'
import { set } from 'lodash'
import { getMiddleConfig } from "../../config/middleware.config"
import { awaitWrap } from 'utils'
import { RedisClientService } from '../middleware/redisClient.service'

const { redisConfig, kafkaConfig } = getMiddleConfig()

const Producer = kafka.Producer
const kafkaClient = new kafka.KafkaClient({ kafkaHost: kafkaConfig.kafkaHost })
const producer = new Producer(kafkaClient, {
  // Configuration for when to consider a message as acknowledged, default 1
  requireAcks: 1,
  // The amount of time in milliseconds to wait for all acks before considered, default 100ms
  ackTimeoutMs: 100,
  // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
  partitionerType: 2,
})

@Injectable()
export class InventoryService {
  logger = new Logger('Inventory Service')

  inventoryRedisClient!: Redis.Redis

  count = 0

  constructor(private readonly redisClientService: RedisClientService) {
    this.redisClientService.getInventoryClient().then(client => {
      this.inventoryRedisClient = client
    })
  }

  async initCount() {
    const { inventoryCounter } = redisConfig

    return await this.inventoryRedisClient.set(inventoryCounter, 100)
  }

  async queryInventory(params) {
    const { inventoryCounter } = redisConfig

    this.logger.log(`Current count：${this.count++}`)

    //TIPS: Using optimistic locking to ensure inventory safety
    const [watchError] = await awaitWrap(this.inventoryRedisClient.watch(inventoryCounter)) //Mointer Counter filed
    watchError && this.logger.error(watchError)
    if (watchError) return watchError

    const [getError, reply] = await awaitWrap(this.inventoryRedisClient.get(inventoryCounter))
    getError && this.logger.error(getError)
    if (getError) return getError

    if (parseInt(reply) <= 0) {
      this.logger.warn('Already sold out')
      return "Already sold out"
    }

    //更新redis的counter数量减一
    const [execError, replies] = await awaitWrap(this.inventoryRedisClient.multi().decr(inventoryCounter).exec())
    execError && this.logger.error(execError)
    if (execError) return execError

    //counter字段正在操作中，等待counter被其他释放
    if (!replies) {
      this.logger.warn('Counter is in use')
      this.queryInventory(params)
      return
    }

    // this.logger.log('replies: ')
    // this.logger.verbose(replies)
    set(params, 'remainCount', replies[0]?.[1])

    const payload = [
      {
        topic: kafkaConfig.topic,
        partition: 0,
        messages: [JSON.stringify(params)],
      },
    ]

    this.logger.log('生产数据payload:')
    this.logger.verbose(payload)

    return new Promise((resolve, reject) => {
      producer.send(payload, (err, kafkaProducerResponse) => {
        if (err) {
          this.logger.error(err)
          reject(err)
          return err
        }

        this.logger.verbose(kafkaProducerResponse)
        resolve({ payload, kafkaProducerResponse })
      })
    })
  }

  // 设置剩余库存
  async setRemainCount(remainCount: number) {
    const { inventoryCounter } = redisConfig

    //TIPS:使用乐观锁解决高并发
    const [watchError] = await awaitWrap(this.inventoryRedisClient.watch(inventoryCounter)) //监听counter字段
    watchError && this.logger.error(watchError)
    if (watchError) return watchError

    //更新redis的counter数量
    const [execError, replies] = await awaitWrap(this.inventoryRedisClient.multi().set(inventoryCounter, remainCount).get(inventoryCounter).exec())
    execError && this.logger.error(execError)
    if (execError) return execError

    //counter字段正在操作中，等待counter被其他释放
    if (!replies) {
      this.logger.warn('counter被使用')
      return this.setRemainCount(remainCount)
    }

    console.log('replies: ', replies)
    return `更新剩余商品数成功！现在剩余：${replies?.[1]?.[1]}`
  }
}