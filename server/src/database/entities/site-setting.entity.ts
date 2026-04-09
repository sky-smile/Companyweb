import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'site_settings' })
export class SiteSettingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'setting_key', type: 'varchar', length: 80, unique: true })
  settingKey!: string;

  @Column({ name: 'setting_value', type: 'longtext', default: '' })
  settingValue!: string;

  @Column({ name: 'setting_group', type: 'varchar', length: 50, default: 'general' })
  settingGroup!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column({ name: 'updated_by', type: 'bigint', unsigned: true, nullable: true })
  updatedBy!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
