import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import * as Redis from 'ioredis'
import { InventoryController } from './inventory.controller';
import { CreateOrderDTO } from '../order/order.dto'
import { InventoryService } from './inventory.service';
import { OrderModule } from '../order/order.module';
import { OrderService } from '../order/order.service';
import { awaitWrap } from 'utils'
import { getKafkaConsumer } from '../middleware/kafka-utils'
import { RedisClientService } from '../middleware/redisClient.service';

@Module({
  imports: [OrderModule],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [],
})
export class InventoryModule implements OnApplicationBootstrap{
  logger = new Logger('Inventory Module')

  inventoryRedisClient!: Redis.Redis

  constructor(
    private readonly orderService: OrderService,
    private readonly inventoryService: InventoryService,
    private readonly redisClientService: RedisClientService
  ) {
    this.redisClientService.getInventoryClient().then(client => {
      this.inventoryRedisClient = client
    })
  }

  async handleListenerKafkaMessage() {
    const kafkaConsumer = getKafkaConsumer()

    kafkaConsumer.on('message', async message => {
      this.logger.log('得到的生产者的数据为：')
      this.logger.verbose(message)

      let value!: CreateOrderDTO

      if (typeof message.value === 'string') {
        value = JSON.parse(message.value)
      } else {
        value = JSON.parse(message.value.toString())
      }
      value.kafkaRawMessage = JSON.stringify(message)

      const [err, order] = await awaitWrap(this.orderService.createOrder(value))
      if (err) {
        this.logger.error(err)
        return
      }
      this.logger.log(`订单【${order.id}】信息已存入数据库`)
    })
  }

  async onApplicationBootstrap() {
    this.logger.log('onApplicationBootstrap: ')
    await this.inventoryService.initCount()
    // await initKafkaTopic();
    this.handleListenerKafkaMessage()
  }
}
