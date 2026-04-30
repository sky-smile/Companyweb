import { IsIn, IsNumber } from 'class-validator';

export class UpdateStatusDto {
  @IsNumber()
  @IsIn([0, 1])
  status!: number;
}
