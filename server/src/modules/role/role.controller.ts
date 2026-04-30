import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateStatusDto } from '@/common/dto/update-status.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Permissions('roles:view')
  list() {
    return this.roleService.list();
  }

  @Get('permissions')
  @Permissions('roles:view')
  listPermissions() {
    return this.roleService.listPermissions();
  }

  @Post()
  @Permissions('roles:create')
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Patch(':id')
  @Permissions('roles:update')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Patch(':id/status')
  @Permissions('roles:status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.roleService.updateStatus(id, dto);
  }
}
