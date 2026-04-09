import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductListQueryDto } from './dto/product-list-query.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  listCategories() {
    return this.productRepository.listCategories();
  }

  createCategory(dto: CreateProductCategoryDto) {
    return this.productRepository.createCategory(dto);
  }

  updateCategory(id: string, dto: UpdateProductCategoryDto) {
    return this.productRepository.updateCategory(id, dto);
  }

  deleteCategory(id: string) {
    return this.productRepository.deleteCategory(id);
  }

  async list(query: ProductListQueryDto, publicOnly = false) {
    const page = Number(query.page ?? 1) || 1;
    const pageSize = Number(query.pageSize ?? 10) || 10;
    const list = await this.productRepository.listProducts(publicOnly);
    const filtered = list.filter((item) => {
      if (query.keyword === undefined || query.keyword.trim() === '') {
        return true;
      }

      return [item.name, item.summary, item.slug].some((value) =>
        value.toLowerCase().includes(query.keyword!.toLowerCase()),
      );
    });

    const start = (page - 1) * pageSize;

    return {
      list: filtered.slice(start, start + pageSize),
      pagination: {
        page,
        pageSize,
        total: filtered.length,
      },
    };
  }

  detail(id: string, publicOnly = false) {
    return this.productRepository.detail(id, publicOnly);
  }

  create(dto: CreateProductDto, currentUser: AuthenticatedAdminUser) {
    return this.productRepository.create(dto, currentUser.userId);
  }

  update(id: string, dto: UpdateProductDto, currentUser: AuthenticatedAdminUser) {
    return this.productRepository.update(id, dto, currentUser.userId);
  }

  delete(id: string) {
    return this.productRepository.delete(id);
  }
}
