import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiEnvelope } from '../utiles/api-envelope.decorator.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { DeleteTagResponseDto } from './dto/delete-tag-response.dto.js';
import { Tag } from './entities/tag.entity.js';
import { TagService } from './tag.service.js';

@ApiTags('Tags')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /** List all tags */
  @Get()
  @ApiEnvelope(Tag, { isArray: true })
  getTags() {
    return this.tagService.findAllTags();
  }

  /** Get a tag by id */
  @Get(':id')
  @ApiEnvelope(Tag)
  @ApiNotFoundResponse({ description: 'Tag not found' })
  getTagById(@Param('id') id: string) {
    return this.tagService.findTagById(id);
  }

  /** Create a tag */
  @Post()
  @ApiEnvelope(Tag, { status: HttpStatus.CREATED })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  /** Replace a tag */
  @Put(':id')
  @ApiEnvelope(Tag)
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiNotFoundResponse({ description: 'Tag not found' })
  updateTag(@Param('id') id: string, @Body() createTagDto: CreateTagDto) {
    return this.tagService.updateTag(id, createTagDto);
  }

  /** Delete a tag */
  @Delete(':id')
  @ApiEnvelope(DeleteTagResponseDto)
  @ApiNotFoundResponse({ description: 'Tag not found' })
  deleteTag(@Param('id') id: string) {
    return this.tagService.deleteTag(id);
  }
}
