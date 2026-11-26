import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Serves Swagger UI at `/docs` and the OpenAPI document at `/docs-json`.
 * Opt-in through `SWAGGER_ENABLED=true`, because global guards do not protect
 * these routes.
 */
export function setupSwagger(app: INestApplication): void {
  if (app.get(ConfigService).get<string>('SWAGGER_ENABLED') !== 'true') {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('REST API for managing tasks and their tags.')
    .setVersion('1.0')
    .build();

  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, config),
  );
}
