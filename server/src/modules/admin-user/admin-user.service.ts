import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ResetAdminUserPasswordDto } from './dto/reset-admin-user-password.dto';
import { UpdateAdminUserStatusDto } from './dto/update-admin-user-status.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminUserListQueryDto } from './dto/admin-user-list-query.dto';

export interface AdminUserView {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  isSuperAdmin: boolean;
  roles: string[];
}

@Injectable()
export class AdminUserService {
  private static readonly adminUsers: AdminUserView[] = [
    {
      id: '1',
      username: 'admin',
      nickname: 'Super Admin',
      email: '',
      phone: '',
      status: 1,
      isSuperAdmin: true,
      roles: ['super-admin'],
    },
  ];

  list(query: AdminUserListQueryDto) {
    const page = Number(query.page ?? 1) || 1;
    const pageSize = Number(query.pageSize ?? 10) || 10;

    const filtered = AdminUserService.adminUsers.filter((item) => {
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
    if (AdminUserService.adminUsers.some((item) => item.username === dto.username)) {
      throw new BadRequestException('Username already exists');
    }

    const adminUser: AdminUserView = {
      id: String(AdminUserService.adminUsers.length + 1),
      username: dto.username,
      nickname: dto.nickname,
      email: dto.email ?? '',
      phone: dto.phone ?? '',
      status: 1,
      isSuperAdmin: false,
      roles: dto.roleIds ?? [],
    };

    AdminUserService.adminUsers.push(adminUser);

    return adminUser;
  }

  update(id: string, dto: UpdateAdminUserDto) {
    const adminUser = this.findByIdOrThrow(id);

    adminUser.nickname = dto.nickname ?? adminUser.nickname;
    adminUser.email = dto.email ?? adminUser.email;
    adminUser.phone = dto.phone ?? adminUser.phone;
    adminUser.roles = dto.roleIds ?? adminUser.roles;

    return adminUser;
  }

  updateStatus(id: string, dto: UpdateAdminUserStatusDto, currentUser: AuthenticatedAdminUser) {
    const adminUser = this.findByIdOrThrow(id);
    this.ensureSuperAdminProtected(adminUser, currentUser);
    adminUser.status = dto.status;
    return adminUser;
  }

  resetPassword(
    id: string,
    dto: ResetAdminUserPasswordDto,
    currentUser: AuthenticatedAdminUser,
  ) {
    const adminUser = this.findByIdOrThrow(id);
    this.ensureSuperAdminProtected(adminUser, currentUser);

    return {
      id: adminUser.id,
      username: adminUser.username,
      tempPassword: dto.newPassword,
      message: 'Password persistence will be connected in the repository phase',
    };
  }

  private findByIdOrThrow(id: string): AdminUserView {
    const adminUser = AdminUserService.adminUsers.find((item) => item.id === id);

    if (adminUser === undefined) {
      throw new NotFoundException('Admin user not found');
    }

    return adminUser;
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
