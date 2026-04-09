import { http, unwrapResponse } from './http';
import {
  CreateProductCategoryPayload,
  CreateProductPayload,
  ProductCategoryItem,
  ProductItem,
  ProductListResult,
  UpdateProductCategoryPayload,
  UpdateProductPayload,
} from '../types/product';

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

  updateCategory(id: string, payload: UpdateProductCategoryPayload) {
    return unwrapResponse<ProductCategoryItem>(http.patch(`/admin/product-categories/${id}`, payload));
  },

  deleteCategory(id: string) {
    return unwrapResponse(http.delete(`/admin/product-categories/${id}`));
  },

  detail(id: string) {
    return unwrapResponse<ProductItem>(http.get(`/admin/products/${id}`));
  },

  create(payload: CreateProductPayload) {
    return unwrapResponse<ProductItem>(http.post('/admin/products', payload));
  },

  update(id: string, payload: UpdateProductPayload) {
    return unwrapResponse<ProductItem>(http.patch(`/admin/products/${id}`, payload));
  },

  delete(id: string) {
    return unwrapResponse(http.delete(`/admin/products/${id}`));
  },
};
