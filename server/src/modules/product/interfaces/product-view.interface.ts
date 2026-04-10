export interface ProductView {
  id: string;
  name: string;
  slug: string;
  summary: string;
  content: string;
  imagesJson: string;
  parametersJson: string;
  status: number;
  sort: number;
  publishedAt: Date | null;
  categoryId: string;
  categoryName: string;
}
