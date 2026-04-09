import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'banners' })
export class BannerEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'varchar', length: 150, default: '' })
  title!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  subtitle!: string;

  @Column({ name: 'image_url', type: 'varchar', length: 255 })
  imageUrl!: string;

  @Column({ name: 'link_url', type: 'varchar', length: 255, default: '' })
  linkUrl!: string;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  status!: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
