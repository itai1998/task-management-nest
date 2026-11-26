import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity.js';
import { TaskService } from './task.service.js';

describe('TaskService', () => {
  let service: TaskService;
  const repo = { find: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useValue: repo },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('loads tasks together with their tags', async () => {
    repo.find.mockResolvedValue([]);

    await expect(service.findAllTasks()).resolves.toEqual([]);
    expect(repo.find).toHaveBeenCalledWith({ relations: { tags: true } });
  });

  it('sorts tasks newest first, then by numeric id', async () => {
    const older = new Date('2026-06-10');
    const newer = new Date('2026-06-12');
    repo.find.mockResolvedValue([
      { task_id: '10', created_at: older, tags: [] },
      { task_id: '2', created_at: older, tags: [] },
      { task_id: '11', created_at: newer, tags: [] },
    ]);

    const tasks = await service.findAllTasks();

    expect(tasks.map((task) => task.task_id)).toEqual(['11', '2', '10']);
  });

  it('sorts the tags of a task by numeric id', async () => {
    repo.find.mockResolvedValue([
      {
        task_id: '1',
        created_at: new Date(),
        tags: [{ tag_id: '10' }, { tag_id: '5' }, { tag_id: '6' }],
      },
    ]);

    const [task] = await service.findAllTasks();

    expect(task.tags.map((tag) => tag.tag_id)).toEqual(['5', '6', '10']);
  });
});
