import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateNewsDto {
  @IsString()
  categoryId!: string;

  @IsString()
  @MaxLength(150)
  title!: string;

  @IsString()
  @MaxLength(180)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  summary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  coverImage?: string;

  @IsString()
  @MaxLength(100000)
  content!: string;

  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  @IsInt()
  @Min(0)
  status = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  @IsInt()
  @Min(0)
  isTop = 0;
}
