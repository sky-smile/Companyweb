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
import { PermissionEntity } from '@/database/entities/permission.entity';
import { AdminUserRoleEntity } from '@/database/entities/admin-user-role.entity';
import { RolePermissionEntity } from '@/database/entities/role-permission.entity';
import { RoleEntity } from '@/database/entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleView } from './interfaces/role-view.interface';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async list(): Promise<RoleView[]> {
    const roles = await this.roleRepository.find({
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });

    return roles.map((role) => this.toView(role));
  }

  async findById(id: string): Promise<RoleView> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
    });

    if (role === null) {
      throw new NotFoundException('Role not found');
    }

    return this.toView(role);
  }

  async create(dto: CreateRoleDto): Promise<RoleView> {
    const existingRole = await this.roleRepository.findOne({ where: { code: dto.code } });

    if (existingRole !== null) {
      throw new BadRequestException('Role code already exists');
    }

    const permissionIds = dto.permissionIds ?? [];

    const roleId = await this.dataSource.transaction(async (manager) => {
      const roleRepo = manager.getRepository(RoleEntity);
      const role = await roleRepo.save(
        roleRepo.create({
          name: dto.name,
          code: dto.code,
          description: dto.description ?? '',
          status: 1,
        }),
      );

      await this.replacePermissionsInTransaction(manager, role.id, permissionIds);

      return role.id;
    });

    return this.findById(roleId);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleView> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (role === null) {
      throw new NotFoundException('Role not found');
    }

    role.name = dto.name ?? role.name;
    role.description = dto.description ?? role.description;

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(RoleEntity).save(role);

      if (dto.permissionIds !== undefined) {
        await this.replacePermissionsInTransaction(manager, id, dto.permissionIds);
      }
    });

    return this.findById(id);
  }

  async updateStatus(id: string, status: number): Promise<RoleView> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (role === null) {
      throw new NotFoundException('Role not found');
    }

    role.status = status;
    await this.roleRepository.save(role);

    return this.findById(id);
  }

  async listPermissions(): Promise<Array<{ id: string; name: string; code: string }>> {
    const permissions = await this.permissionRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      code: permission.code,
    }));
  }

  private async replacePermissionsInTransaction(
    manager: EntityManager,
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    const rpRepo = manager.getRepository(RolePermissionEntity);

    await rpRepo.delete({ roleId });

    if (permissionIds.length === 0) {
      return;
    }

    const permRepo = manager.getRepository(PermissionEntity);
    const permissions = await permRepo.findBy(
      permissionIds.map((id) => ({ id })),
    );

    for (const permission of permissions) {
      await rpRepo.save(
        rpRepo.create({
          roleId,
          permissionId: permission.id,
        }),
      );
    }
  }

  async delete(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { rolePermissions: true },
    });

    if (role === null) {
      throw new NotFoundException('角色不存在');
    }

    if (role.code === 'super-admin') {
      throw new BadRequestException('不能删除超级管理员角色');
    }

    await this.dataSource.transaction(async (manager) => {
      const rpRepo = manager.getRepository(RolePermissionEntity);
      await rpRepo.delete({ roleId: id });

      const aurRepo = manager.getRepository(AdminUserRoleEntity);
      await aurRepo.delete({ roleId: id });

      await manager.getRepository(RoleEntity).delete(id);
    });

    // 清理孤立的 role_permissions 记录（防御性清理）
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('admin_user_roles')
      .where('roleId NOT IN (SELECT id FROM roles)')
      .execute();
  }

  private toView(role: RoleEntity): RoleView {
    return {
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description,
      status: role.status,
      permissions: (role.rolePermissions ?? []).map((item) => item.permission.code),
    };
  }
}
