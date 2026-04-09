import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryEntity } from '@/database/entities/product-category.entity';
import { ProductEntity } from '@/database/entities/product.entity';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { PublicProductController } from './public-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductCategoryEntity])],
  controllers: [ProductController, PublicProductController],
  providers: [ProductRepository, ProductService],
})
export class ProductModule {}
