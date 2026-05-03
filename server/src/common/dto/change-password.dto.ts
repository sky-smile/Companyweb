import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsStrongPassword } from '@/common/validators/password.validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(10)
  @MaxLength(50)
  oldPassword!: string;

  @IsString()
  @IsStrongPassword()
  @MaxLength(50)
  newPassword!: string;
}
