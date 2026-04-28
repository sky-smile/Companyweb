import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';
import { hashPassword, verifyPassword } from '@/common/utils/password.util';
import { AdminUserRoleEntity } from '@/database/entities/admin-user-role.entity';
import { AdminUserEntity } from '@/database/entities/admin-user.entity';
import { RoleEntity } from '@/database/entities/role.entity';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminUserView } from './interfaces/admin-user-view.interface';

@Injectable()
export class AdminUserRepository {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(AdminUserRoleEntity)
    private readonly adminUserRoleRepository: Repository<AdminUserRoleEntity>,
  ) {}

  async list(): Promise<AdminUserView[]> {
    const adminUsers = await this.adminUserRepository.find({
      relations: {
        adminUserRoles: {
          role: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });

    return adminUsers.map((item) => this.toView(item));
  }

  async findById(id: string): Promise<AdminUserView> {
    const adminUser = await this.adminUserRepository.findOne({
      where: { id },
      relations: {
        adminUserRoles: {
          role: true,
        },
      },
    });

    if (adminUser === null) {
      throw new NotFoundException('Admin user not found');
    }

    return this.toView(adminUser);
  }

  async create(dto: CreateAdminUserDto): Promise<AdminUserView> {
    await this.ensureUsernameAvailable(dto.username);
    await this.ensureRoleIdsExist(dto.roleIds ?? []);

    const passwordHash = await hashPassword(dto.password);
    const adminUser = await this.adminUserRepository.save(
      this.adminUserRepository.create({
        username: dto.username,
        passwordHash,
        nickname: dto.nickname,
        email: dto.email ?? '',
        phone: dto.phone ?? '',
        status: 1,
        isSuperAdmin: 0,
        lastLoginAt: null,
        lastLoginIp: null,
      }),
    );

    await this.replaceRoles(adminUser.id, dto.roleIds ?? []);

    return this.findById(adminUser.id);
  }

  async update(id: string, dto: UpdateAdminUserDto): Promise<AdminUserView> {
    const adminUser = await this.adminUserRepository.findOne({ where: { id } });

    if (adminUser === null) {
      throw new NotFoundException('Admin user not found');
    }

    if (dto.roleIds !== undefined) {
      await this.ensureRoleIdsExist(dto.roleIds);
    }

    adminUser.nickname = dto.nickname ?? adminUser.nickname;
    adminUser.email = dto.email ?? adminUser.email;
    adminUser.phone = dto.phone ?? adminUser.phone;

    await this.adminUserRepository.save(adminUser);

    if (dto.roleIds !== undefined) {
      await this.replaceRoles(id, dto.roleIds);
    }

    return this.findById(id);
  }

  async updateStatus(id: string, status: number): Promise<AdminUserView> {
    const adminUser = await this.adminUserRepository.findOne({ where: { id } });

    if (adminUser === null) {
      throw new NotFoundException('Admin user not found');
    }

    adminUser.status = status;
    await this.adminUserRepository.save(adminUser);

    return this.findById(id);
  }

  async resetPassword(id: string, newPassword: string): Promise<AdminUserView> {
    const adminUser = await this.adminUserRepository.findOne({ where: { id } });

    if (adminUser === null) {
      throw new NotFoundException('Admin user not found');
    }

    adminUser.passwordHash = await hashPassword(newPassword);
    await this.adminUserRepository.save(adminUser);

    return this.findById(id);
  }

  async updateOwnPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const adminUser = await this.adminUserRepository.findOne({ where: { id } });

    if (adminUser === null) {
      throw new NotFoundException('Admin user not found');
    }

    const passwordMatched = await verifyPassword(oldPassword, adminUser.passwordHash);

    if (!passwordMatched) {
      throw new BadRequestException('Old password is incorrect');
    }

    adminUser.passwordHash = await hashPassword(newPassword);
    await this.adminUserRepository.save(adminUser);
  }

  private async replaceRoles(adminUserId: string, roleIds: string[]): Promise<void> {
    await this.adminUserRoleRepository.delete({ adminUserId });

    if (roleIds.length === 0) {
      return;
    }

    const roles = await this.roleRepository.findBy(roleIds.map((id) => ({ id })));

    for (const role of roles) {
      await this.adminUserRoleRepository.save(
        this.adminUserRoleRepository.create({
          adminUserId,
          roleId: role.id,
        }),
      );
    }
  }

  private async ensureUsernameAvailable(username: string): Promise<void> {
    const existingUser = await this.adminUserRepository.findOne({ where: { username } });

    if (existingUser !== null) {
      throw new BadRequestException('Username already exists');
    }
  }

  private async ensureRoleIdsExist(roleIds: string[]): Promise<void> {
    if (roleIds.length === 0) {
      return;
    }

    const roles = await this.roleRepository.findBy(roleIds.map((id) => ({ id })));

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('One or more roles do not exist');
    }
  }

  private toView(adminUser: AdminUserEntity): AdminUserView {
    return {
      id: adminUser.id,
      username: adminUser.username,
      nickname: adminUser.nickname,
      email: adminUser.email,
      phone: adminUser.phone,
      status: adminUser.status,
      isSuperAdmin: adminUser.isSuperAdmin === 1,
      roles: (adminUser.adminUserRoles ?? []).map((item) => item.role.code),
    };
  }
}
