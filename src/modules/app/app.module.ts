import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {AppController} from './app.controller';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports:[
    OrderModule,
  ]
})
export class AppModule {
}

