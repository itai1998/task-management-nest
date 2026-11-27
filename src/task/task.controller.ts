import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiEnvelope } from '../utiles/api-envelope.decorator.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { DeleteTaskResponseDto } from './dto/delete-task-response.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
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

  /** Get a task by id */
  @Get(':id')
  @ApiEnvelope(Task)
  @ApiNotFoundResponse({ description: 'Task not found' })
  getTaskById(@Param('id') id: string) {
    return this.taskService.findTaskById(id);
  }

  /** Create a task */
  @Post()
  @ApiEnvelope(Task, { status: HttpStatus.CREATED })
  @ApiBadRequestResponse({ description: 'Invalid body or unknown tag id' })
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  /** Update some fields of a task */
  @Patch(':id')
  @ApiEnvelope(Task)
  @ApiBadRequestResponse({ description: 'Invalid body or unknown tag id' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  /** Delete a task */
  @Delete(':id')
  @ApiEnvelope(DeleteTaskResponseDto)
  @ApiNotFoundResponse({ description: 'Task not found' })
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
