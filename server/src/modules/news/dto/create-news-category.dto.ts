import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateNewsCategoryDto {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsString()
  @MaxLength(80)
  slug!: string;

  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  @IsInt()
  @Min(0)
  sort = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value ?? 1))
  @IsInt()
  @Min(0)
  @Max(1)
  status = 1;
}
