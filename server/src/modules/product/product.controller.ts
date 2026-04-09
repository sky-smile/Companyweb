import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request.type';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductListQueryDto } from './dto/product-list-query.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('product-categories')
  @Permissions('product-category:view')
  listCategories() {
    return this.productService.listCategories();
  }

  @Post('product-categories')
  @Permissions('product-category:create')
  createCategory(@Body() dto: CreateProductCategoryDto) {
    return this.productService.createCategory(dto);
  }

  @Patch('product-categories/:id')
  @Permissions('product-category:update')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateProductCategoryDto) {
    return this.productService.updateCategory(id, dto);
  }

  @Delete('product-categories/:id')
  @Permissions('product-category:delete')
  deleteCategory(@Param('id') id: string) {
    return this.productService.deleteCategory(id);
  }

  @Get('products')
  @Permissions('product:view')
  list(@Query() query: ProductListQueryDto) {
    return this.productService.list(query, false);
  }

  @Get('products/:id')
  @Permissions('product:view')
  detail(@Param('id') id: string) {
    return this.productService.detail(id, false);
  }

  @Post('products')
  @Permissions('product:create')
  create(@Body() dto: CreateProductDto, @Req() request: AuthenticatedRequest) {
    return this.productService.create(dto, request.user);
  }

  @Patch('products/:id')
  @Permissions('product:update')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.productService.update(id, dto, request.user);
  }

  @Delete('products/:id')
  @Permissions('product:delete')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
