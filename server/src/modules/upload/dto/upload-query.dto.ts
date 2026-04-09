import { IsOptional, IsString } from 'class-validator';

export class UploadQueryDto {
  @IsOptional()
  @IsString()
  folder?: string;
}
