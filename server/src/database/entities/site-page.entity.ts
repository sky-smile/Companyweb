import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'site_pages' })
export class SitePageEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'page_key', type: 'varchar', length: 50, unique: true })
  pageKey!: string;

  @Column({ type: 'varchar', length: 150, default: '' })
  title!: string;

  @Column({ type: 'longtext', default: '' })
  content!: string;

  @Column({ name: 'extra_json', type: 'longtext', default: '' })
  extraJson!: string;

  @Column({ name: 'seo_title', type: 'varchar', length: 180, default: '' })
  seoTitle!: string;

  @Column({ name: 'seo_description', type: 'varchar', length: 255, default: '' })
  seoDescription!: string;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  status!: number;

  @Column({ name: 'updated_by', type: 'bigint', unsigned: true, nullable: true })
  updatedBy!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
