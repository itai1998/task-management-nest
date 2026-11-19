import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { Tag } from './entities/tag.entity.js';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  findAllTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findTagById(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOneBy({ tag_id: id });
    if (!tag) {
      throw new NotFoundException(`Tag with id '${id}' not found`);
    }
    return tag;
  }

  createTag(createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagRepository.save(this.tagRepository.create(createTagDto));
  }

  async updateTag(id: string, createTagDto: CreateTagDto): Promise<Tag> {
    const tag = await this.findTagById(id);
    return this.tagRepository.save(Object.assign(tag, createTagDto));
  }

  async deleteTag(id: string) {
    const result = await this.tagRepository.delete({ tag_id: id });
    if (!result.affected) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }
    return { message: 'Tag deleted successfully' };
  }
}
