import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateStatusDto } from '@/common/dto/update-status.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  list() {
    return this.roleRepository.list();
  }

  listPermissions() {
    return this.roleRepository.listPermissions();
  }

  create(dto: CreateRoleDto) {
    return this.roleRepository.create(dto);
  }

  update(id: string, dto: UpdateRoleDto) {
    return this.roleRepository.update(id, dto);
  }

  updateStatus(id: string, dto: UpdateStatusDto) {
    return this.roleRepository.updateStatus(id, dto.status);
  }

  async delete(id: string) {
    await this.roleRepository.delete(id);
    return { success: true, message: '角色已删除' };
  }
}
