import { http, unwrapResponse } from './http';
import { CreateProductCategoryPayload, ProductCategoryItem, ProductListResult } from '../types/product';

export const productService = {
  list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return unwrapResponse<ProductListResult>(http.get('/admin/products', { params }));
  },

  listCategories() {
    return unwrapResponse<ProductCategoryItem[]>(http.get('/admin/product-categories'));
  },

  createCategory(payload: CreateProductCategoryPayload) {
    return unwrapResponse<ProductCategoryItem>(http.post('/admin/product-categories', payload));
  },
};
