import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity'
import { CreateOrderDTO, UpdateOrderDTO } from './order.dto';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  //find order by order id 
  getOrderById(id: string) {
    return this.orderRepository.findOne({ where: { id } } )
  }

  //create order 
  async createOrder(Order: CreateOrderDTO){
    const newOrder = await this.orderRepository.create(Order);
    await this.orderRepository.save(newOrder);
  }

  //update order
  async updateOrderById(id: string, post: UpdateOrderDTO){
    await this.orderRepository.update(id, post);
    const updateOrder = await this.orderRepository.findOne({ where: { id } });
    if (updateOrder) {
      return updateOrder;
    }

    throw new HttpException('Target Order not found', HttpStatus.NOT_FOUND);
  }

  //delete order
  async deleteOrder(id: string ){
    const deleteOrder = await this.orderRepository.delete(id);
    if (!deleteOrder.affected) {
        throw new HttpException('Target Order not found', HttpStatus.NOT_FOUND);
      }
  }

  // getHelloWorldMsg(): string{
  //   return "Hello world from creating order";
  // }

  

}
