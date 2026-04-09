import { http, unwrapResponse } from './http';
import {
  CreateNewsCategoryPayload,
  CreateNewsPayload,
  NewsCategoryItem,
  NewsItem,
  NewsListResult,
  UpdateNewsCategoryPayload,
  UpdateNewsPayload,
} from '../types/news';

export const newsService = {
  list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return unwrapResponse<NewsListResult>(http.get('/admin/news', { params }));
  },

  listCategories() {
    return unwrapResponse<NewsCategoryItem[]>(http.get('/admin/news-categories'));
  },

  createCategory(payload: CreateNewsCategoryPayload) {
    return unwrapResponse<NewsCategoryItem>(http.post('/admin/news-categories', payload));
  },

  updateCategory(id: string, payload: UpdateNewsCategoryPayload) {
    return unwrapResponse<NewsCategoryItem>(http.patch(`/admin/news-categories/${id}`, payload));
  },

  deleteCategory(id: string) {
    return unwrapResponse(http.delete(`/admin/news-categories/${id}`));
  },

  detail(id: string) {
    return unwrapResponse<NewsItem>(http.get(`/admin/news/${id}`));
  },

  create(payload: CreateNewsPayload) {
    return unwrapResponse<NewsItem>(http.post('/admin/news', payload));
  },

  update(id: string, payload: UpdateNewsPayload) {
    return unwrapResponse<NewsItem>(http.patch(`/admin/news/${id}`, payload));
  },

  delete(id: string) {
    return unwrapResponse(http.delete(`/admin/news/${id}`));
  },
};
