import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'role_permissions' })
export class RolePermissionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'role_id', type: 'bigint', unsigned: true })
  roleId!: string;

  @Column({ name: 'permission_id', type: 'bigint', unsigned: true })
  permissionId!: string;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions, {
    nullable: false,
  })
  @JoinColumn({ name: 'permission_id' })
  permission!: PermissionEntity;
}
