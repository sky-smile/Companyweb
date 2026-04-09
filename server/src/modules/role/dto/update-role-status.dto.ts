import { IsIn, IsNumber } from 'class-validator';

export class UpdateRoleStatusDto {
  @IsNumber()
  @IsIn([0, 1])
  status!: number;
}
