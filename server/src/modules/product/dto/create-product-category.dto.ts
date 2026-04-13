import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductCategoryDto {
  @IsString()
  @MaxLength(80)
  name!: string;

  @IsString()
  @MaxLength(100)
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
  status = 1;
}
