import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  /**
   * Display name of the tag
   * @example 'Urgent'
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Color used to display the tag
   * @example 'red'
   */
  @IsString()
  @IsNotEmpty()
  color: string;

  /**
   * Whether this is a common tag
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  is_common: boolean;
}
