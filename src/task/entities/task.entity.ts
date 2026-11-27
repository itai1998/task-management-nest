import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import { Tag } from '../../tag/entities/tag.entity.js';

@Entity('task')
export class Task {
  // The DB fills this from the task_task_id_seq sequence when it is omitted.
  /**
   * Unique id of the task
   * @example '1'
   */
  @PrimaryColumn({
    type: 'text',
    default: () => "nextval('task_task_id_seq')::text",
  })
  task_id: string;

  /**
   * Human-readable task number
   * @example 'TASK-001'
   */
  @Column({ type: 'text', unique: true })
  task_no: string;

  /** @example 'Design login page' */
  @Column({ type: 'text' })
  title: string;

  /** @example 'Create wireframes and UI for login' */
  @Column({ type: 'text', default: '' })
  description: string;

  /** @example 'Use brand colors' */
  @Column({ type: 'text', default: '' })
  note: string;

  /** 0 = Todo, 1 = InProgress, 2 = Done */
  @Column({ type: 'integer', default: 1 })
  status: number;

  /** 0 = Low, 1 = Medium, 2 = High */
  @Column({ type: 'integer', default: 1 })
  priority: number;

  @ManyToMany(() => Tag, (tag) => tag.tasks)
  @JoinTable({
    name: 'task_tag',
    joinColumn: { name: 'task_id', referencedColumnName: 'task_id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
  })
  tags: Tag[];

  /** @example 'alice' */
  @Column({ type: 'text', default: '' })
  assignee: string;

  /** @example ['bob', 'carol'] */
  @Column({ type: 'text', array: true, default: () => "'{}'" })
  collaborator: string[];

  /** @example 'dave' */
  @Column({ type: 'text' })
  creator: string;

  /** @example 'dave' */
  @Column({ type: 'text' })
  last_editor: string;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date | null;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  updated_at: Date;
}
