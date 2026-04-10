export interface NewsView {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  status: number;
  isTop: number;
  publishedAt: Date | null;
  categoryId: string;
  categoryName: string;
}
