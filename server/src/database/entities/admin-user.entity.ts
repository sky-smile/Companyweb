import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminUserRoleEntity } from './admin-user-role.entity';

@Entity({ name: 'admin_users' })
export class AdminUserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  nickname!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  email!: string;

  @Column({ type: 'varchar', length: 30, default: '' })
  phone!: string;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  status!: number;

  @Column({ name: 'is_super_admin', type: 'tinyint', width: 1, default: 0 })
  isSuperAdmin!: number;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ name: 'last_login_ip', type: 'varchar', length: 64, nullable: true })
  lastLoginIp!: string | null;

  @Column({ name: 'token_version', type: 'int', default: 0 })
  tokenVersion!: number;

  @OneToMany(() => AdminUserRoleEntity, (adminUserRole) => adminUserRole.adminUser)
  adminUserRoles!: AdminUserRoleEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
