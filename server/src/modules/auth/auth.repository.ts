import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUserEntity } from '@/database/entities/admin-user.entity';
import { AuthenticatedAdmin } from './interfaces/authenticated-admin.interface';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
  ) {}

  async findByUsername(username: string): Promise<AuthenticatedAdmin | null> {
    const adminUser = await this.adminUserRepository.findOne({
      where: { username },
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

    if (adminUser === null) {
      return null;
    }

    return this.toAuthenticatedAdmin(adminUser);
  }

  async findById(id: string): Promise<AuthenticatedAdmin | null> {
    const adminUser = await this.adminUserRepository.findOne({
      where: { id },
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

    if (adminUser === null) {
      return null;
    }

    return this.toAuthenticatedAdmin(adminUser);
  }

  async updateProfile(id: string, nickname: string): Promise<AuthenticatedAdmin> {
    await this.adminUserRepository.update(id, { nickname });
    const admin = await this.findById(id);
    // 更新后用户一定存在（update 成功即可找到）
    return admin as AuthenticatedAdmin;
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
      tokenVersion: adminUser.tokenVersion,
    };
  }
}
