import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductListQueryDto } from './dto/product-list-query.dto';
import { ProductService } from './product.service';

@Controller('public/products')
export class PublicProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  list(@Query() query: ProductListQueryDto) {
    return this.productService.list(query, true);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.productService.detail(id, true);
  }
}
