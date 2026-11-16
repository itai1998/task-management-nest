import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto.js';
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
    return this.tagService.createTag(createTagDto);
  }

  @Put(':id')
  updateTag(
    @Param('id') id: string,
    @Body() createTagDto: CreateTagDto,
  ): Tag | { message: string } {
    return this.tagService.updateTag(id, createTagDto);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: string): { message: string } {
    return this.tagService.deleteTag(id);
  }
}
