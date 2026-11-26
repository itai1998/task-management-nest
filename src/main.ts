import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './utiles/transform.interceptor.js';
import { setupSwagger } from './utiles/swagger.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
