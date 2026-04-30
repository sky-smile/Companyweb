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

  async list(query: ListQueryDto, publicOnly = false) {
    const { page, pageSize, keyword } = query;
    const { items, total } = await this.productRepository.listProductsPaginated(page, pageSize, keyword, publicOnly);
    return formatPaginatedResult(items, total, page, pageSize);
  }

  detail(id: string, publicOnly = false) {
    return this.productRepository.detail(id, publicOnly);
  }

  create(dto: CreateProductDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    return this.productRepository.create(sanitizedDto, currentUser.userId);
  }

  update(id: string, dto: UpdateProductDto, currentUser: AuthenticatedAdminUser) {
    const sanitizedDto = { ...dto, content: dto.content ? sanitizeHtmlContent(dto.content) : dto.content };
    return this.productRepository.update(id, sanitizedDto, currentUser.userId);
  }

  delete(id: string) {
    return this.productRepository.delete(id);
  }
}
