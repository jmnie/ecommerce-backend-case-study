
import { registerAs } from '@nestjs/config';

export default registerAs('kafkaConfig', () => ({
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
  clientId: process.env.KAFKA_CLIENT_ID || 'my-client',
}));