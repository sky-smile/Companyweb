import { http, unwrapResponse } from './http';
import { CreateNewsCategoryPayload, NewsCategoryItem, NewsListResult } from '../types/news';

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
};
