import { IsIn, IsNumber } from 'class-validator';

export class UpdateAdminUserStatusDto {
  @IsNumber()
  @IsIn([0, 1])
  status!: number;
}
