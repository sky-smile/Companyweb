import { Injectable } from '@nestjs/common';
import { AuthenticatedAdminUser } from '@/common/types/authenticated-request.type';
import { sanitizeHtmlContent } from '@/common/utils/html-sanitizer';
import { formatPaginatedResult } from '@/common/utils/paginate';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { CacheRevalidationService } from '../cache-revalidation/cache-revalidation.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheRevalidation: CacheRevalidationService,
  ) {}

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

  async list(query: ListQueryDto, publicOnly = false) {
    const { page, pageSize, keyword } = query;
    const { items, total } = await this.productRepository.listProductsPaginated(page, pageSize, keyword, publicOnly);
    return formatPaginatedResult(items, total, page, pageSize);
  }

  detail(id: string, publicOnly = false) {
    return this.productRepository.detail(id, publicOnly);
  }

  async create(dto: CreateProductDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    const result = await this.productRepository.create(sanitizedDto, currentUser.userId);
    this.cacheRevalidation.revalidate(['products-list']).catch(() => {});
    return result;
  }

  async update(id: string, dto: UpdateProductDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    const result = await this.productRepository.update(id, sanitizedDto, currentUser.userId);
    this.cacheRevalidation.revalidate(['products-list', `product-${id}`]).catch(() => {});
    return result;
  }

  async delete(id: string) {
    const result = await this.productRepository.delete(id);
    this.cacheRevalidation.revalidate(['products-list', `product-${id}`]).catch(() => {});
    return result;
  }
}
