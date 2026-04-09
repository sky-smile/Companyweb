export interface AnnouncementItem {
  id: string;
  title: string;
  summary: string;
  status: number;
  isTop: number;
}

export interface AnnouncementListResult {
  list: AnnouncementItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CreateAnnouncementPayload {
  title: string;
  summary?: string;
  content: string;
  status?: number;
  isTop?: number;
}
