import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { AdminUserRepository } from './admin-user.repository';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { AdminUserListQueryDto } from './dto/admin-user-list-query.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ResetAdminUserPasswordDto } from './dto/reset-admin-user-password.dto';
import { UpdateAdminUserStatusDto } from './dto/update-admin-user-status.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminUserView } from './interfaces/admin-user-view.interface';

@Injectable()
export class AdminUserService {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async list(query: AdminUserListQueryDto) {
    const page = Number(query.page ?? 1) || 1;
    const pageSize = Number(query.pageSize ?? 10) || 10;
    const adminUsers = await this.adminUserRepository.list();

    const filtered = adminUsers.filter((item) => {
      if (query.keyword === undefined || query.keyword.trim() === '') {
        return true;
      }

      return [item.username, item.nickname, item.email].some((value) =>
        value.toLowerCase().includes(query.keyword!.toLowerCase()),
      );
    });

    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return {
      list,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
      },
    };
  }

  create(dto: CreateAdminUserDto) {
    return this.adminUserRepository.create(dto);
  }

  update(id: string, dto: UpdateAdminUserDto) {
    return this.adminUserRepository.update(id, dto);
  }

  async updateStatus(
    id: string,
    dto: UpdateAdminUserStatusDto,
    currentUser: AuthenticatedAdminUser,
  ) {
    const adminUser = await this.adminUserRepository.findById(id);
    this.ensureSuperAdminProtected(adminUser, currentUser);
    return this.adminUserRepository.updateStatus(id, dto.status);
  }

  async resetPassword(
    id: string,
    dto: ResetAdminUserPasswordDto,
    currentUser: AuthenticatedAdminUser,
  ) {
    const adminUser = await this.adminUserRepository.findById(id);
    this.ensureSuperAdminProtected(adminUser, currentUser);
    const updatedUser = await this.adminUserRepository.resetPassword(id, dto.newPassword);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      message: 'Password reset successfully',
    };
  }

  async updateOwnPassword(userId: string, dto: ChangeOwnPasswordDto) {
    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    await this.adminUserRepository.updateOwnPassword(userId, dto.oldPassword, dto.newPassword);

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }

  private ensureSuperAdminProtected(
    targetUser: AdminUserView,
    currentUser: AuthenticatedAdminUser,
  ): void {
    if (targetUser.isSuperAdmin && !currentUser.isSuperAdmin) {
      throw new BadRequestException('Super admin can only be modified by another super admin');
    }
  }
}
