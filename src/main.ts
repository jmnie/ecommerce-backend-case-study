import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { getAppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const {host, port} = getAppConfig().config
  await app.listen(port, host);
}

bootstrap();
