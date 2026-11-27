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

  describe('writes', () => {
    const manager = {
      findOne: vi.fn(),
      findBy: vi.fn(),
      query: vi.fn(),
      create: vi.fn((_entity, task) => task),
      save: vi.fn(),
    };

    beforeEach(() => {
      Object.assign(repo, {
        manager: {
          ...manager,
          transaction: (work: (m: typeof manager) => unknown) => work(manager),
        },
      });
      manager.findOne.mockResolvedValue({ task_id: '4', tags: [] });
      manager.query.mockResolvedValue([{ id: '4' }]);
    });

    it('creates a task with defaults and a generated number', async () => {
      await service.createTask({ title: 'T', creator: 'dave' });

      expect(manager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          task_id: '4',
          task_no: 'TASK-004',
          status: 0,
          priority: 1,
          last_editor: 'dave',
          due_date: null,
          tags: [],
        }),
      );
    });

    it('saves nothing when a tag does not exist', async () => {
      manager.findBy.mockResolvedValue([{ tag_id: '5' }]);

      await expect(
        service.createTask({ title: 'T', creator: 'd', tag_ids: ['5', '99'] }),
      ).rejects.toThrow('Tags not found: 99');
      expect(manager.save).not.toHaveBeenCalled();
    });

    it('keeps the fields an update leaves out', async () => {
      manager.findOne.mockResolvedValue({
        task_id: '4',
        title: 'Old',
        tags: [{ tag_id: '5' }],
      });

      await service.updateTask('4', {
        title: undefined,
        last_editor: 'alice',
      });

      expect(manager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Old',
          tags: [{ tag_id: '5' }],
          last_editor: 'alice',
          updated_at: expect.any(Date),
        }),
      );
    });

    it('throws when the task to update does not exist', async () => {
      manager.findOne.mockResolvedValue(null);

      await expect(
        service.updateTask('99', { last_editor: 'alice' }),
      ).rejects.toThrow("Task with id '99' not found");
    });
  });
});
