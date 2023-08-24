
const MiddlewareConfig = {
  database: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'temp_password',
    database: 'mysql',
  },
  redisCache: {
    host: 'localhost',
    port: 6379,
    duration: 30 * 1000, //cache for 30s
  },
  redisConfig: {
    inventoryCounter: 'secKillCounter', //库存计数器key
    inventoryHashKey: 'seckill-temp',
    inventoryTempLockKey: 'lock-seckill-update', //同步锁的键
    url: 'redis://localhost:6379',
    name: 'inventoryRedis',
    host: 'localhost',
    port: 6379,
    db: 1,
  },
  kafkaConfig: {
    kafkaHost: 'localhost:9092',
    topic: 'PHONE_NUMBER',
    partitionMaxIndex: 0, //Producer发送数据时分区范围(0,partitionCount)
  },
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],
}

export default MiddlewareConfig

export const getMiddleConfig = () =>{
  return MiddlewareConfig
}