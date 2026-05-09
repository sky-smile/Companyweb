import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
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
    private readonly dataSource: DataSource,
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

  async listPaginated(
    page: number,
    pageSize: number,
    keyword?: string,
  ): Promise<{ items: AdminUserView[]; total: number }> {
    const qb = this.adminUserRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.adminUserRoles', 'aur')
      .leftJoinAndSelect('aur.role', 'role')
      .orderBy('user.id', 'ASC');

    if (keyword && keyword.trim() !== '') {
      qb.andWhere(
        '(user.username LIKE :kw OR user.nickname LIKE :kw OR user.email LIKE :kw)',
        { kw: `%${keyword}%` },
      );
    }

    qb.skip((page - 1) * pageSize).take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    return { items: items.map((item) => this.toView(item)), total };
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
    const roleIds = dto.roleIds ?? [];

    const adminUserId = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(AdminUserEntity);
      const adminUser = await userRepo.save(
        userRepo.create({
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

      await this.replaceRolesInTransaction(manager, adminUser.id, roleIds);

      return adminUser.id;
    });

    return this.findById(adminUserId);
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

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(AdminUserEntity).save(adminUser);

      if (dto.roleIds !== undefined) {
        await this.replaceRolesInTransaction(manager, id, dto.roleIds);
      }
    });

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
    adminUser.tokenVersion += 1; // revoke all existing sessions
    await this.adminUserRepository.save(adminUser);
  }

  async incrementTokenVersion(id: string): Promise<void> {
    await this.adminUserRepository.increment({ id }, 'tokenVersion', 1);
  }

  private async replaceRolesInTransaction(
    manager: EntityManager,
    adminUserId: string,
    roleIds: string[],
  ): Promise<void> {
    const aurRepo = manager.getRepository(AdminUserRoleEntity);

    await aurRepo.delete({ adminUserId });

    if (roleIds.length === 0) {
      return;
    }

    const roleRepo = manager.getRepository(RoleEntity);
    const roles = await roleRepo.findBy(roleIds.map((id) => ({ id })));

    for (const role of roles) {
      await aurRepo.save(
        aurRepo.create({
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

  async delete(id: string): Promise<void> {
    const adminUser = await this.adminUserRepository.findOne({
      where: { id },
      relations: { adminUserRoles: true },
    });

    if (adminUser === null) {
      throw new NotFoundException('管理员不存在');
    }

    if (adminUser.isSuperAdmin === 1) {
      throw new BadRequestException('不能删除超级管理员');
    }

    await this.dataSource.transaction(async (manager) => {
      const aurRepo = manager.getRepository(AdminUserRoleEntity);
      await aurRepo.delete({ adminUserId: id });
      await manager.getRepository(AdminUserEntity).delete(id);
    });
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
