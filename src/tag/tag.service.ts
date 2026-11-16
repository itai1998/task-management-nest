import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto.js';
import type { Tag } from './interfaces/tag.interface.js';

@Injectable()
export class TagService {
  // TODO: use a database instead of a file
  private readonly tagsFilePath = join(
    process.cwd(),
    'src',
    'tag',
    'mock',
    'tags.json',
  );
  private tags: Tag[] = JSON.parse(
    readFileSync(this.tagsFilePath, 'utf-8'),
  ) as Tag[];

  findAllTags(): Tag[] {
    return this.tags;
  }

  findTagById(id: string): Tag | { message: string } {
    const tag = this.tags.find((tag) => tag.tag_id === id);
    if (!tag) {
      return { message: 'Tag not found' };
    }
    return tag;
  }

  createTag(createTagDto: CreateTagDto): Tag {
    const tag: Tag = {
      tag_id: String(Date.now()),
      ...createTagDto,
    };
    this.tags.push(tag);
    writeFileSync(this.tagsFilePath, JSON.stringify(this.tags, null, 2));
    return tag;
  }

  updateTag(id: string, createTagDto: CreateTagDto): Tag {
    const index = this.tags.findIndex((tag) => tag.tag_id === id);
    if (index === -1) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    const updatedTag: Tag = {
      tag_id: id,
      ...createTagDto,
    };
    this.tags[index] = updatedTag;
    writeFileSync(this.tagsFilePath, JSON.stringify(this.tags, null, 2));
    return updatedTag;
  }

  deleteTag(id: string): { message: string } {
    const index = this.tags.findIndex((tag) => tag.tag_id === id);
    if (index === -1) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }
    this.tags.splice(index, 1);
    writeFileSync(this.tagsFilePath, JSON.stringify(this.tags, null, 2));
    return { message: 'Tag deleted successfully' };
  }
}
