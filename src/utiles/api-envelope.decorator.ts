import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface ApiEnvelopeOptions {
  status?: HttpStatus;
  isArray?: boolean;
}

/**
 * Documents a successful response as `TransformInterceptor` sends it:
 * `{ statusCode, message, data }`, where `data` is `model`.
 */
export function ApiEnvelope(
  model: Type<unknown>,
  { status = HttpStatus.OK, isArray = false }: ApiEnvelopeOptions = {},
) {
  const item = { $ref: getSchemaPath(model) };

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      schema: {
        type: 'object',
        required: ['statusCode', 'message', 'data'],
        properties: {
          statusCode: { type: 'integer', example: status },
          message: { type: 'string', example: 'Success' },
          data: isArray ? { type: 'array', items: item } : item,
        },
      },
    }),
  );
}
