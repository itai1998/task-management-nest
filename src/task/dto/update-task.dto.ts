import { OmitType, PartialType } from '@nestjs/swagger';
import { IsRequiredText } from '../../utiles/is-required-text.decorator.js';
import { CreateTaskDto } from './create-task.dto.js';

/** Omitted fields stay unchanged. `creator` can never be changed. */
export class UpdateTaskDto extends PartialType(
  OmitType(CreateTaskDto, ['creator'] as const),
  // Keeps `null` invalid, except where `CreateTaskDto` allows it.
  { skipNullProperties: false },
) {
  /** @example 'alice' */
  @IsRequiredText()
  last_editor: string;
}
