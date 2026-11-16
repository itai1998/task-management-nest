import { Injectable } from '@nestjs/common';

export interface Tag {
  tag_id: string;
  name: string;
  color: string;
  is_common: boolean;
}

@Injectable()
export class TagService {
  private tags: Tag[] = [
    {
      tag_id: '1',
      name: 'Design',
      color: 'red',
      is_common: true,
    },
    {
      tag_id: '2',
      name: 'Frontend',
      color: 'blue',
      is_common: true,
    },
  ];

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
}
