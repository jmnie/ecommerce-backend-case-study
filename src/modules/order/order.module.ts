import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule } from '@nestjs/microservices';
@Module({
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
