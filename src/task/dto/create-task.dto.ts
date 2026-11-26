import { Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import {
  IsRequiredText,
  trim,
} from '../../utiles/is-required-text.decorator.js';

const unique = (values: unknown[]) => [...new Set(values)];

/** The field may be left out, but unlike `@IsOptional()` it rejects `null`. */
const MayBeOmitted = () => ValidateIf((_, value) => value !== undefined);

// A date, or a date and time that states its timezone.
const DATE_OR_ZONED_DATE_TIME =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/;

export class CreateTaskDto {
  /** @example 'Design login page' */
  @IsRequiredText()
  title: string;

  /** @example 'Create wireframes and UI for login' */
  @MayBeOmitted()
  @IsString()
  description?: string;

  /** @example 'Use brand colors' */
  @MayBeOmitted()
  @IsString()
  note?: string;

  /**
   * 0 = Todo (default), 1 = InProgress, 2 = Done
   * @example 0
   */
  @MayBeOmitted()
  @IsIn([0, 1, 2])
  status?: number;

  /**
   * 0 = Low, 1 = Medium (default), 2 = High
   * @example 1
   */
  @MayBeOmitted()
  @IsIn([0, 1, 2])
  priority?: number;

  /**
   * Ids of existing tags
   * @example ['5', '6']
   */
  @MayBeOmitted()
  @Transform(({ value }) => (Array.isArray(value) ? unique(value) : value))
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tag_ids?: string[];

  /** @example 'alice' */
  @MayBeOmitted()
  @IsString()
  assignee?: string;

  /** @example ['bob', 'carol'] */
  @MayBeOmitted()
  @Transform(({ value }) =>
    Array.isArray(value) ? unique(value.map(trim)) : value,
  )
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  collaborator?: string[];

  /** @example 'dave' */
  @IsRequiredText()
  creator: string;

  /**
   * ISO 8601 date, or date and time with a timezone
   * @example '2026-12-20'
   */
  @IsOptional()
  @IsISO8601({ strict: true })
  @Matches(DATE_OR_ZONED_DATE_TIME, {
    message: 'due_date must be a date, or a date and time with a timezone',
  })
  due_date?: string | null;
}
