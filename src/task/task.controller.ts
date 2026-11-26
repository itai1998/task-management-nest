import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEnvelope } from '../utiles/api-envelope.decorator.js';
import { Task } from './entities/task.entity.js';
import { TaskService } from './task.service.js';

@ApiTags('Tasks')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** List all tasks with their tags */
  @Get()
  @ApiEnvelope(Task, { isArray: true })
  getTasks() {
    return this.taskService.findAllTasks();
  }
}
