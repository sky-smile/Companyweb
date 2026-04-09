import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeOwnPasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  oldPassword!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  newPassword!: string;
}
