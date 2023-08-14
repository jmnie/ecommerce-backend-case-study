import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Connection, Repository, FindOneOptions } from 'typeorm'
import { OrderService } from './order.service';

@ApiTags('Order Management')
@Controller("order")
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @Get()
    getOrderPage() {
      return 'Welcome to the order page!'; // 返回你想要的内容
    }

    

    // @Post("createOrder")
    // async createOrder(@Body() orderData: any){
    //   try{
    //     const order = await this.orderService.createOrder(orderData);
    //     return {message: 'Order created succeessfully', order};
    //   }catch(error){
    //     return {message: 'Order cration failed',error: error.message}
    //   }
    // }

    // @Get("orderHello")
    // getOrderHello(): string {
    //   return this.orderService.getHelloWorldMsg();
    // }

}
