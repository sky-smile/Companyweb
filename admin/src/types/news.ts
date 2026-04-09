export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  status: number;
  isTop: number;
  categoryId: string;
  categoryName: string;
}

export interface NewsCategoryItem {
  id: string;
  name: string;
  slug: string;
  sort: number;
  status: number;
}

export interface NewsListResult {
  list: NewsItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CreateNewsCategoryPayload {
  name: string;
  slug: string;
  sort?: number;
}
