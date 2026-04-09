import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserRoleEntity } from '@/database/entities/admin-user-role.entity';
import { AdminUserEntity } from '@/database/entities/admin-user.entity';
import { RoleEntity } from '@/database/entities/role.entity';
import { AdminUserController } from './admin-user.controller';
import { AdminUserRepository } from './admin-user.repository';
import { AdminUserService } from './admin-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity, RoleEntity, AdminUserRoleEntity])],
  controllers: [AdminUserController],
  providers: [AdminUserRepository, AdminUserService],
  exports: [AdminUserRepository],
})
export class AdminUserModule {}
