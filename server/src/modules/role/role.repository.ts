import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityMetadataNotFoundError,
  Repository,
} from 'typeorm';
import { PermissionEntity } from '@/database/entities/permission.entity';
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
    if (!this.isDatabaseReady()) {
      return [this.getFallbackRole()];
    }

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
    if (!this.isDatabaseReady()) {
      if (id === '1') {
        return this.getFallbackRole();
      }

      throw new NotFoundException('Role not found');
    }

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
    if (!this.isDatabaseReady()) {
      return {
        id: '2',
        name: dto.name,
        code: dto.code,
        description: dto.description ?? '',
        status: 1,
        permissions: dto.permissionIds ?? [],
      };
    }

    const existingRole = await this.roleRepository.findOne({ where: { code: dto.code } });

    if (existingRole !== null) {
      throw new BadRequestException('Role code already exists');
    }

    const role = await this.roleRepository.save(
      this.roleRepository.create({
        name: dto.name,
        code: dto.code,
        description: dto.description ?? '',
        status: 1,
      }),
    );

    await this.replacePermissions(role.id, dto.permissionIds ?? []);

    return this.findById(role.id);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleView> {
    if (!this.isDatabaseReady()) {
      const role = this.getFallbackRole();

      if (id !== role.id) {
        throw new NotFoundException('Role not found');
      }

      return {
        ...role,
        name: dto.name ?? role.name,
        description: dto.description ?? role.description,
        permissions: dto.permissionIds ?? role.permissions,
      };
    }

    const role = await this.roleRepository.findOne({ where: { id } });

    if (role === null) {
      throw new NotFoundException('Role not found');
    }

    role.name = dto.name ?? role.name;
    role.description = dto.description ?? role.description;

    await this.roleRepository.save(role);

    if (dto.permissionIds !== undefined) {
      await this.replacePermissions(id, dto.permissionIds);
    }

    return this.findById(id);
  }

  async updateStatus(id: string, status: number): Promise<RoleView> {
    if (!this.isDatabaseReady()) {
      const role = this.getFallbackRole();

      if (id !== role.id) {
        throw new NotFoundException('Role not found');
      }

      return {
        ...role,
        status,
      };
    }

    const role = await this.roleRepository.findOne({ where: { id } });

    if (role === null) {
      throw new NotFoundException('Role not found');
    }

    role.status = status;
    await this.roleRepository.save(role);

    return this.findById(id);
  }

  async listPermissions(): Promise<Array<{ id: string; name: string; code: string }>> {
    if (!this.isDatabaseReady()) {
      return [
        {
          id: '1',
          name: 'All permissions',
          code: '*:*',
        },
      ];
    }

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

  private async replacePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await this.rolePermissionRepository.delete({ roleId });

    if (permissionIds.length === 0) {
      return;
    }

    const permissions = await this.permissionRepository.findBy(
      permissionIds.map((id) => ({ id })),
    );

    for (const permission of permissions) {
      await this.rolePermissionRepository.save(
        this.rolePermissionRepository.create({
          roleId,
          permissionId: permission.id,
        }),
      );
    }
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

  private isDatabaseReady(): boolean {
    if (!this.dataSource.isInitialized) {
      return false;
    }

    try {
      return this.dataSource.hasMetadata(RoleEntity);
    } catch (error) {
      return !(error instanceof EntityMetadataNotFoundError);
    }
  }

  private getFallbackRole(): RoleView {
    return {
      id: '1',
      name: 'Super Admin',
      code: 'super-admin',
      description: 'Full access role for system bootstrapping',
      status: 1,
      permissions: ['*:*'],
    };
  }
}
