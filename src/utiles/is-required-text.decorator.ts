import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export const trim = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value;

/** A string that is trimmed and must not be blank. */
export const IsRequiredText = () =>
  applyDecorators(
    Transform(({ value }) => trim(value)),
    IsString(),
    IsNotEmpty(),
  );
