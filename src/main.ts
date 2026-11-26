import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './utiles/transform.interceptor.js';
import { setupSwagger } from './utiles/swagger.js';
import { createValidationPipe } from './utiles/validation.pipe.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
