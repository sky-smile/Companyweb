import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NewsCategoryEntity } from './news-category.entity';

@Entity({ name: 'news' })
export class NewsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'category_id', type: 'bigint', unsigned: true })
  categoryId!: string;

  @ManyToOne(() => NewsCategoryEntity, (category) => category.newsList, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category!: NewsCategoryEntity;

  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  summary!: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 255, default: '' })
  coverImage!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  status!: number;

  @Column({ name: 'is_top', type: 'tinyint', width: 1, default: 0 })
  isTop!: number;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt!: Date | null;

  @Column({ name: 'seo_title', type: 'varchar', length: 180, default: '' })
  seoTitle!: string;

  @Column({ name: 'seo_description', type: 'varchar', length: 255, default: '' })
  seoDescription!: string;

  @Column({ name: 'created_by', type: 'bigint', unsigned: true, nullable: true })
  createdBy!: string | null;

  @Column({ name: 'updated_by', type: 'bigint', unsigned: true, nullable: true })
  updatedBy!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
