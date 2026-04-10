export interface AnnouncementView {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: number;
  isTop: number;
  publishedAt: Date | null;
}
