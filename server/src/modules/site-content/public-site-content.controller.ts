import { Controller, Get } from '@nestjs/common';
import { SiteContentService } from './site-content.service';

@Controller('public')
export class PublicSiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get('home')
  getHome() {
    return this.siteContentService.getHomeContent();
  }

  @Get('about')
  getAbout() {
    return this.siteContentService.getAboutContent();
  }

  @Get('contact')
  getContact() {
    return this.siteContentService.getContactContent();
  }
}
