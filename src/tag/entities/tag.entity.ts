import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tag')
export class Tag {
  // The DB fills this from the tag_tag_id_seq sequence when it is omitted.
  @PrimaryColumn({
    type: 'text',
    default: () => "nextval('tag_tag_id_seq')::text",
  })
  tag_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  color: string;

  @Column({ type: 'boolean' })
  is_common: boolean;
}
