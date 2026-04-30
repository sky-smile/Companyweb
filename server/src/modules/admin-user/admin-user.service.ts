import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { formatPaginatedResult } from '@/common/utils/paginate';
import { AdminUserRepository } from './admin-user.repository';
import { ChangePasswordDto } from '@/common/dto/change-password.dto';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { UpdateStatusDto } from '@/common/dto/update-status.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ResetAdminUserPasswordDto } from './dto/reset-admin-user-password.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminUserView } from './interfaces/admin-user-view.interface';

@Injectable()
export class AdminUserService {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async list(query: ListQueryDto) {
    const { page, pageSize, keyword } = query;
    const { items, total } = await this.adminUserRepository.listPaginated(page, pageSize, keyword);
    return formatPaginatedResult(items, total, page, pageSize);
  }

  create(dto: CreateAdminUserDto) {
    return this.adminUserRepository.create(dto);
  }

  update(id: string, dto: UpdateAdminUserDto) {
    return this.adminUserRepository.update(id, dto);
  }

  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
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

  async updateOwnPassword(userId: string, dto: ChangePasswordDto) {
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
