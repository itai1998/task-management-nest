import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    for (const task of tasks) {
      task.tags.sort((a, b) => Number(a.tag_id) - Number(b.tag_id));
    }

    return tasks.sort(
      (a, b) =>
        b.created_at.getTime() - a.created_at.getTime() ||
        Number(a.task_id) - Number(b.task_id),
    );
  }
}
