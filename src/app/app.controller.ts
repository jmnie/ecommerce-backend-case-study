import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService) {}
  
  @Get()
  getAppPage() {
    return 'Welcome to the order page!'; 
  }

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }
}
