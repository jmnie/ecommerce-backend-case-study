import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity'

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }


  findOneById(id: string) {
    return this.orderRepository.findOne({ where: { id } } )
  }


  // getHelloWorldMsg(): string{
  //   return "Hello world from creating order";
  // }

  

}
