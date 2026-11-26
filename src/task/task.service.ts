import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /** Newest first. Ids are stored as text, so they are compared as numbers. */
  async findAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      relations: { tags: true },
    });

    tasks.forEach((task) => this.sortTags(task));

    return tasks.sort(
      (a, b) =>
        b.created_at.getTime() - a.created_at.getTime() ||
        Number(a.task_id) - Number(b.task_id),
    );
  }

  findTaskById(id: string): Promise<Task> {
    return this.findTaskOrFail(this.taskRepository.manager, id);
  }

  createTask({ tag_ids = [], due_date, ...fields }: CreateTaskDto) {
    return this.taskRepository.manager.transaction(async (manager) => {
      const tags = await this.findTagsOrFail(manager, tag_ids);
      // The id is reserved first because `task_no` is derived from it.
      const [{ id }] = await manager.query(
        "SELECT nextval('task_task_id_seq')::text AS id",
      );

      await manager.save(
        manager.create(Task, {
          description: '',
          note: '',
          status: 0,
          priority: 1,
          assignee: '',
          collaborator: [],
          ...this.withoutUndefined(fields),
          task_id: id,
          task_no: `TASK-${id.padStart(3, '0')}`,
          last_editor: fields.creator,
          due_date: due_date ? new Date(due_date) : null,
          tags,
        }),
      );

      return this.findTaskOrFail(manager, id);
    });
  }

  updateTask(id: string, { tag_ids, due_date, ...fields }: UpdateTaskDto) {
    return this.taskRepository.manager.transaction(async (manager) => {
      const task = await this.findTaskOrFail(manager, id);

      Object.assign(task, this.withoutUndefined(fields));
      if (due_date !== undefined) {
        task.due_date = due_date === null ? null : new Date(due_date);
      }
      if (tag_ids !== undefined) {
        // Saving the new list adds and removes the `task_tag` rows.
        task.tags = await this.findTagsOrFail(manager, tag_ids);
      }
      // Set here so that a change to the tags alone also counts as an edit.
      task.updated_at = new Date();

      await manager.save(task);

      return this.findTaskOrFail(manager, id);
    });
  }

  async deleteTask(id: string) {
    // The database removes the related `task_tag` rows (ON DELETE CASCADE).
    const result = await this.taskRepository.delete({ task_id: id });
    if (!result.affected) {
      throw this.taskNotFound(id);
    }
    return { message: 'Task deleted successfully' };
  }

  private async findTaskOrFail(
    manager: EntityManager,
    id: string,
  ): Promise<Task> {
    const task = await manager.findOne(Task, {
      where: { task_id: id },
      relations: { tags: true },
    });
    if (!task) {
      throw this.taskNotFound(id);
    }
    return this.sortTags(task);
  }

  private async findTagsOrFail(
    manager: EntityManager,
    ids: string[],
  ): Promise<Tag[]> {
    if (ids.length === 0) {
      return [];
    }

    const tags = await manager.findBy(Tag, { tag_id: In(ids) });
    const found = new Set(tags.map((tag) => tag.tag_id));
    const missing = ids.filter((id) => !found.has(id));
    if (missing.length > 0) {
      throw new BadRequestException(`Tags not found: ${missing.join(', ')}`);
    }
    return tags;
  }

  private sortTags(task: Task): Task {
    task.tags.sort((a, b) => Number(a.tag_id) - Number(b.tag_id));
    return task;
  }

  // A transformed DTO holds `undefined` for every field the client left out.
  private withoutUndefined<T extends object>(fields: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
  }

  private taskNotFound(id: string) {
    return new NotFoundException(`Task with id '${id}' not found`);
  }
}
