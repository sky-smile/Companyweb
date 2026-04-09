import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryEntity } from '@/database/entities/product-category.entity';
import { ProductEntity } from '@/database/entities/product.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductView } from './interfaces/product-view.interface';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  listCategories() {
    return this.productCategoryRepository.find({
      order: {
        sort: 'ASC',
        id: 'ASC',
      },
    });
  }

  async createCategory(dto: CreateProductCategoryDto) {
    const existing = await this.productCategoryRepository.findOne({ where: { slug: dto.slug } });

    if (existing !== null) {
      throw new BadRequestException('Product category slug already exists');
    }

    return this.productCategoryRepository.save(
      this.productCategoryRepository.create({
        name: dto.name,
        slug: dto.slug,
        sort: dto.sort,
        status: 1,
      }),
    );
  }

  async updateCategory(id: string, dto: UpdateProductCategoryDto) {
    const category = await this.productCategoryRepository.findOne({ where: { id } });

    if (category === null) {
      throw new NotFoundException('Product category not found');
    }

    if (dto.slug !== undefined && dto.slug !== category.slug) {
      const existing = await this.productCategoryRepository.findOne({ where: { slug: dto.slug } });

      if (existing !== null) {
        throw new BadRequestException('Product category slug already exists');
      }
    }

    category.name = dto.name ?? category.name;
    category.slug = dto.slug ?? category.slug;
    category.sort = dto.sort ?? category.sort;
    category.status = dto.status ?? category.status;

    return this.productCategoryRepository.save(category);
  }

  async deleteCategory(id: string) {
    const count = await this.productRepository.count({ where: { categoryId: id } });

    if (count > 0) {
      throw new BadRequestException('Cannot delete category with existing products');
    }

    const result = await this.productCategoryRepository.delete({ id });

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('Product category not found');
    }
  }

  async listProducts(publicOnly = false): Promise<ProductView[]> {
    const products = await this.productRepository.find({
      where: publicOnly ? { status: 1 } : {},
      relations: {
        category: true,
      },
      order: {
        sort: 'ASC',
        id: 'DESC',
      },
    });

    return products.map((item) => this.toView(item));
  }

  async detail(id: string, publicOnly = false): Promise<ProductView> {
    const product = await this.productRepository.findOne({
      where: publicOnly ? { id, status: 1 } : { id },
      relations: {
        category: true,
      },
    });

    if (product === null) {
      throw new NotFoundException('Product not found');
    }

    return this.toView(product);
  }

  async create(dto: CreateProductDto, userId: string): Promise<ProductView> {
    await this.ensureCategoryExists(dto.categoryId);
    await this.ensureSlugAvailable(dto.slug);

    const product = await this.productRepository.save(
      this.productRepository.create({
        categoryId: dto.categoryId,
        name: dto.name,
        slug: dto.slug,
        summary: dto.summary ?? '',
        content: dto.content ?? '',
        imagesJson: dto.imagesJson ?? '',
        parametersJson: dto.parametersJson ?? '',
        status: dto.status,
        publishedAt: dto.status === 1 ? new Date() : null,
        sort: dto.sort,
        createdBy: userId,
        updatedBy: userId,
      }),
    );

    return this.detail(product.id);
  }

  async update(id: string, dto: UpdateProductDto, userId: string): Promise<ProductView> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (product === null) {
      throw new NotFoundException('Product not found');
    }

    if (dto.categoryId !== undefined) {
      await this.ensureCategoryExists(dto.categoryId);
      product.categoryId = dto.categoryId;
    }

    if (dto.slug !== undefined && dto.slug !== product.slug) {
      await this.ensureSlugAvailable(dto.slug);
      product.slug = dto.slug;
    }

    product.name = dto.name ?? product.name;
    product.summary = dto.summary ?? product.summary;
    product.content = dto.content ?? product.content;
    product.imagesJson = dto.imagesJson ?? product.imagesJson;
    product.parametersJson = dto.parametersJson ?? product.parametersJson;
    product.status = dto.status ?? product.status;
    product.publishedAt = product.status === 1 ? product.publishedAt ?? new Date() : null;
    product.sort = dto.sort ?? product.sort;
    product.updatedBy = userId;

    await this.productRepository.save(product);

    return this.detail(id);
  }

  async delete(id: string) {
    const result = await this.productRepository.delete({ id });

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.productCategoryRepository.findOne({ where: { id: categoryId } });

    if (category === null) {
      throw new BadRequestException('Product category does not exist');
    }
  }

  private async ensureSlugAvailable(slug: string) {
    const existing = await this.productRepository.findOne({ where: { slug } });

    if (existing !== null) {
      throw new BadRequestException('Product slug already exists');
    }
  }

  private toView(item: ProductEntity): ProductView {
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      summary: item.summary,
      imagesJson: item.imagesJson,
      parametersJson: item.parametersJson,
      status: item.status,
      sort: item.sort,
      categoryId: item.categoryId,
      categoryName: item.category?.name ?? '',
    };
  }
}
