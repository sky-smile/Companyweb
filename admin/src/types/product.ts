export interface ProductCategoryItem {
  id: string;
  name: string;
  slug: string;
  sort: number;
  status: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  summary: string;
  imagesJson: string;
  parametersJson: string;
  status: number;
  sort: number;
  categoryId: string;
  categoryName: string;
}

export interface ProductListResult {
  list: ProductItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CreateProductCategoryPayload {
  name: string;
  slug: string;
  sort?: number;
}

export interface UpdateProductCategoryPayload {
  name?: string;
  slug?: string;
  sort?: number;
  status?: number;
}

export interface CreateProductPayload {
  categoryId: string;
  name: string;
  slug: string;
  summary?: string;
  content?: string;
  imagesJson?: string;
  parametersJson?: string;
  status?: number;
  sort?: number;
}

export interface UpdateProductPayload extends CreateProductPayload {}
