import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListQueryDto } from '@/common/dto/list-query.dto';
import { ProductService } from './product.service';

@Controller('public/products')
export class PublicProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  list(@Query() query: ListQueryDto) {
    return this.productService.list(query, true);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.productService.detail(id, true);
  }
}
