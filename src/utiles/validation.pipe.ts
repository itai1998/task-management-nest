import { ValidationPipe } from '@nestjs/common';

/** Validates request DTOs and rejects any field they do not declare. */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
}
