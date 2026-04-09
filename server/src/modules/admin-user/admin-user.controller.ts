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
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request.type';
import { AdminUserService } from './admin-user.service';
import { AdminUserListQueryDto } from './dto/admin-user-list-query.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ResetAdminUserPasswordDto } from './dto/reset-admin-user-password.dto';
import { UpdateAdminUserStatusDto } from './dto/update-admin-user-status.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin-users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  list(@Query() query: AdminUserListQueryDto) {
    return this.adminUserService.list(query);
  }

  @Post()
  create(@Body() dto: CreateAdminUserDto) {
    return this.adminUserService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.adminUserService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserStatusDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.adminUserService.updateStatus(id, dto, request.user);
  }

  @Patch(':id/reset-password')
  resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetAdminUserPasswordDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.adminUserService.resetPassword(id, dto, request.user);
  }
}
