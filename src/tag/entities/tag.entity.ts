import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Task } from '../../task/entities/task.entity.js';

@Entity('tag')
export class Tag {
  // The DB fills this from the tag_tag_id_seq sequence when it is omitted.
  /**
   * Unique id of the tag
   * @example '1'
   */
  @PrimaryColumn({
    type: 'text',
    default: () => "nextval('tag_tag_id_seq')::text",
  })
  tag_id: string;

  /**
   * Display name of the tag
   * @example 'Urgent'
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * Color used to display the tag
   * @example 'red'
   */
  @Column({ type: 'text' })
  color: string;

  /**
   * Whether this is a common tag
   * @example true
   */
  @Column({ type: 'boolean' })
  is_common: boolean;

  // Only present when a query asks for the relation, so it is not documented.
  @ApiHideProperty()
  @ManyToMany(() => Task, (task) => task.tags)
  tasks?: Task[];
}
