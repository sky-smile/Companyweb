import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request.type';
import { AdminUserService } from './admin-user.service';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { AdminUserListQueryDto } from './dto/admin-user-list-query.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ResetAdminUserPasswordDto } from './dto/reset-admin-user-password.dto';
import { UpdateAdminUserStatusDto } from './dto/update-admin-user-status.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin-users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @Permissions('admin-users:view')
  list(@Query() query: AdminUserListQueryDto) {
    return this.adminUserService.list(query);
  }

  @Post()
  @Permissions('admin-users:create')
  create(@Body() dto: CreateAdminUserDto) {
    return this.adminUserService.create(dto);
  }

  @Patch(':id')
  @Permissions('admin-users:update')
  update(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.adminUserService.update(id, dto);
  }

  @Patch(':id/status')
  @Permissions('admin-users:status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserStatusDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.adminUserService.updateStatus(id, dto, request.user);
  }

  @Patch(':id/reset-password')
  @Permissions('admin-users:reset-password')
  resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetAdminUserPasswordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.adminUserService.resetPassword(id, dto, request.user);
  }

  @Post('change-password')
  @Permissions('admin-users:change-password')
  changeOwnPassword(
    @Req() request: AuthenticatedRequest,
    @Body() dto: ChangeOwnPasswordDto,
  ) {
    return this.adminUserService.updateOwnPassword(request.user.userId, dto);
  }
}
