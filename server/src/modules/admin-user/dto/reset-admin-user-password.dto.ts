import { IsString, MaxLength } from 'class-validator';
import { IsStrongPassword } from '@/common/validators/password.validator';

export class ResetAdminUserPasswordDto {
  @IsString()
  @IsStrongPassword()
  @MaxLength(50)
  newPassword!: string;
}
