import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminUserEntity } from './admin-user.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'admin_user_roles' })
export class AdminUserRoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'admin_user_id', type: 'bigint', unsigned: true })
  adminUserId!: string;

  @Column({ name: 'role_id', type: 'bigint', unsigned: true })
  roleId!: string;

  @ManyToOne(() => AdminUserEntity, (adminUser) => adminUser.adminUserRoles, {
    nullable: false,
  })
  @JoinColumn({ name: 'admin_user_id' })
  adminUser!: AdminUserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.adminUserRoles, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;
}
