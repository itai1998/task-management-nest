import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { Tag, TagService } from './tag.service.js';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getTags(): Tag[] {
    return this.tagService.findAllTags();
  }

  @Get(':id')
  getTagById(@Param('id') id: string) {
    return this.tagService.findTagById(id);
  }

  @Post()
  createTag(@Body() createTagDto: CreateTagDto) {
    return { data: createTagDto, message: 'Tag created successfully' };
  }

  @Put(':id')
  updateTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return { data: id, ...updateTagDto, message: 'Tag updated successfully' };
  }
}
