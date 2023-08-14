import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateOrderDTO, UpdateOrderDTO } from './order.dto'
import { OrderService } from './order.service'

@ApiTags('Order Management')
@Controller("order")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get('')
    getOrderPage() {
      return 'Welcome to the order page!'; // 返回你想要的内容
    }

    @Get('/all')
    @ApiOperation({description: 'get all orders' })
    getOrders() {
        return this.orderService.getAllOrders();
    }

    @Get(':id')
    getOrderById(@Param('id') id: string) {
        return this.orderService.getOrderById(id);
    }

    @Post('/createOrder')
    @ApiOperation({description: 'create order'})
    async createTodo(@Body() createOrderDto: CreateOrderDTO) {
        return this.orderService.createOrder(createOrderDto);
    }

    // update order by id 
    @Put(':id')
    @ApiOperation({description: 'update order by id'})
    async updatePost(@Param('id') id: string, @Body() updateOrder: UpdateOrderDTO) {
        return this.orderService.updateOrderById(id, updateOrder);
    }

    //delete order
    @Delete(':id')
    @ApiOperation({description: 'delete order by id'})
    async deleteOrder(@Param('id') id: string) {
        this.orderService.deleteOrder(id);
    }
}
