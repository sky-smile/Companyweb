import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleStatusDto } from './dto/update-role-status.dto';
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

  updateStatus(id: string, dto: UpdateRoleStatusDto) {
    return this.roleRepository.updateStatus(id, dto.status);
  }
}
