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
import { ChangePasswordDto } from '@/common/dto/change-password.dto';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { UpdateStatusDto } from '@/common/dto/update-status.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ResetAdminUserPasswordDto } from './dto/reset-admin-user-password.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin-users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @Permissions('admin-users:view')
  list(@Query() query: ListQueryDto) {
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
    @Body() dto: UpdateStatusDto,
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
    @Body() dto: ChangePasswordDto,
  ) {
    return this.adminUserService.updateOwnPassword(request.user.userId, dto);
  }
}
