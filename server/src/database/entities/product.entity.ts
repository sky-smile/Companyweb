import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategoryEntity } from './product-category.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'category_id', type: 'bigint', unsigned: true })
  categoryId!: string;

  @ManyToOne(() => ProductCategoryEntity, (category) => category.products, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category!: ProductCategoryEntity;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  summary!: string;

  @Column({ type: 'longtext', default: '' })
  content!: string;

  @Column({ name: 'images_json', type: 'longtext', default: '' })
  imagesJson!: string;

  @Column({ name: 'parameters_json', type: 'longtext', default: '' })
  parametersJson!: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  status!: number;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt!: Date | null;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ name: 'created_by', type: 'bigint', unsigned: true, nullable: true })
  createdBy!: string | null;

  @Column({ name: 'updated_by', type: 'bigint', unsigned: true, nullable: true })
  updatedBy!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
