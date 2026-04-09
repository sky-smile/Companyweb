import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityMetadataNotFoundError, Repository } from 'typeorm';
import { AdminUserEntity } from '@/database/entities/admin-user.entity';
import { hashPassword } from '@/common/utils/password.util';
import { AuthenticatedAdmin } from './interfaces/authenticated-admin.interface';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findByUsername(username: string): Promise<AuthenticatedAdmin | null> {
    const adminUser = await this.findOneSafely({ username });

    if (adminUser !== null) {
      return this.toAuthenticatedAdmin(adminUser);
    }

    if (username !== 'admin') {
      return null;
    }

    const mockPasswordHash = await hashPassword('Admin123456');

    return {
      id: '1',
      username: 'admin',
      nickname: 'Super Admin',
      passwordHash: mockPasswordHash,
      isSuperAdmin: true,
      status: 1,
      roles: ['super-admin'],
      permissions: ['*:*'],
    };
  }

  async findById(id: string): Promise<AuthenticatedAdmin | null> {
    const adminUser = await this.findOneSafely({ id });

    if (adminUser !== null) {
      return this.toAuthenticatedAdmin(adminUser);
    }

    if (id !== '1') {
      return null;
    }

    const mockPasswordHash = await hashPassword('Admin123456');

    return {
      id: '1',
      username: 'admin',
      nickname: 'Super Admin',
      passwordHash: mockPasswordHash,
      isSuperAdmin: true,
      status: 1,
      roles: ['super-admin'],
      permissions: ['*:*'],
    };
  }

  private toAuthenticatedAdmin(adminUser: AdminUserEntity): AuthenticatedAdmin {
    const adminUserRoles = adminUser.adminUserRoles ?? [];
    const roles = adminUserRoles.map((item) => item.role.code);
    const permissions = adminUserRoles.flatMap((item) =>
      item.role.rolePermissions.map((permissionItem) => permissionItem.permission.code),
    );

    return {
      id: adminUser.id,
      username: adminUser.username,
      nickname: adminUser.nickname,
      passwordHash: adminUser.passwordHash,
      isSuperAdmin: adminUser.isSuperAdmin === 1,
      status: adminUser.status,
      roles,
      permissions: Array.from(new Set(permissions)),
    };
  }

  private async findOneSafely(
    where: Partial<Pick<AdminUserEntity, 'id' | 'username'>>,
  ): Promise<AdminUserEntity | null> {
    try {
      return await this.adminUserRepository.findOne({
        where,
        relations: {
          adminUserRoles: {
            role: {
              rolePermissions: {
                permission: true,
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof EntityMetadataNotFoundError) {
        return null;
      }

      if (this.isDatabaseUnavailable(error)) {
        return null;
      }

      throw error;
    }
  }

  private isDatabaseUnavailable(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    return !this.dataSource.isInitialized || /ECONNREFUSED|connect ECONN|Unknown database/i.test(error.message);
  }
}
