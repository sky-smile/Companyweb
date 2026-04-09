import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementEntity } from '@/database/entities/announcement.entity';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementRepository } from './announcement.repository';
import { AnnouncementService } from './announcement.service';
import { PublicAnnouncementController } from './public-announcement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnnouncementEntity])],
  controllers: [AnnouncementController, PublicAnnouncementController],
  providers: [AnnouncementRepository, AnnouncementService],
})
export class AnnouncementModule {}
