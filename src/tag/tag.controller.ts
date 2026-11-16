import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';

@Controller('tag')
export class TagController {
  @Get()
  getTags() {
    return [
      {
        tag_id: 1,
        name: 'Design',
        color: 'red',
        is_common: true,
      },
      {
        tag_id: 2,
        name: 'Frontend',
        color: 'blue',
        is_common: true,
      },
    ];
  }

  @Get(':id')
  getTagById(@Param('id') id: string) {
    return {
      tag_id: id,
      name: 'Design',
      color: 'red',
      is_common: true,
    };
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
