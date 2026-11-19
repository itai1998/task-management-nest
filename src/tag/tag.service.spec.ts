import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Tag } from './entities/tag.entity.js';
import { TagService } from './tag.service.js';

describe('TagService', () => {
  let service: TagService;
  const repo = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn((dto) => dto),
    save: vi.fn((tag) => Promise.resolve(tag)),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: getRepositoryToken(Tag), useValue: repo },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findTagById throws when the tag does not exist', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findTagById('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deleteTag throws when nothing was deleted', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.deleteTag('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
