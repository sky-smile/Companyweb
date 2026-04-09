import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '@/database/entities/permission.entity';
import { RolePermissionEntity } from '@/database/entities/role-permission.entity';
import { RoleEntity } from '@/database/entities/role.entity';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity, RolePermissionEntity])],
  controllers: [RoleController],
  providers: [RoleRepository, RoleService],
  exports: [RoleRepository],
})
export class RoleModule {}
