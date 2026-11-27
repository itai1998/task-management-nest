import { ArgumentMetadata, Type } from '@nestjs/common';
import { createValidationPipe } from '../../utiles/validation.pipe.js';
import { CreateTaskDto } from './create-task.dto.js';
import { UpdateTaskDto } from './update-task.dto.js';

describe('Task DTO validation', () => {
  const validate = (metatype: Type<unknown>, body: object) => {
    const metadata: ArgumentMetadata = { type: 'body', metatype };
    return createValidationPipe().transform(body, metadata);
  };
  const create = (body: object) =>
    validate(CreateTaskDto, { title: 'T', creator: 'dave', ...body });
  const update = (body: object) =>
    validate(UpdateTaskDto, { last_editor: 'alice', ...body });

  it('trims text and removes repeated values', async () => {
    await expect(
      create({
        title: '  T  ',
        tag_ids: ['5', '5', '6'],
        collaborator: ['bob', ' bob '],
      }),
    ).resolves.toMatchObject({
      title: 'T',
      tag_ids: ['5', '6'],
      collaborator: ['bob'],
    });
  });

  it.each([
    { title: '   ' },
    { creator: undefined },
    { status: 3 },
    { priority: '1' },
    { description: null },
    { tag_ids: [5] },
    { collaborator: [' '] },
    { due_date: '2026-02-30' },
    { due_date: '2026-06-20T10:00:00' },
    { task_no: 'TASK-999' },
    { last_editor: 'alice' },
  ])('rejects %o on create', async (body) => {
    await expect(create(body)).rejects.toThrow();
  });

  it.each([
    '2026-06-20',
    '2026-06-20T10:00:00Z',
    '2026-06-20T10:00:00+08:00',
    null,
  ])('accepts due_date %s', async (due_date) => {
    await expect(create({ due_date })).resolves.toMatchObject({ due_date });
    await expect(update({ due_date })).resolves.toMatchObject({ due_date });
  });

  it('allows an update that only names the editor', async () => {
    await expect(update({})).resolves.toMatchObject({ last_editor: 'alice' });
  });

  it.each([
    { last_editor: undefined },
    { title: null },
    { status: null },
    { tag_ids: null },
    { creator: 'mallory' },
  ])('rejects %o on update', async (body) => {
    await expect(update(body)).rejects.toThrow();
  });
});
