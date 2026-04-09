import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SiteSettingItemDto {
  @IsString()
  settingKey!: string;

  @IsString()
  settingValue!: string;

  @IsString()
  settingGroup!: string;

  @IsString()
  description!: string;
}

export class UpdateSiteSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SiteSettingItemDto)
  items!: SiteSettingItemDto[];
}
