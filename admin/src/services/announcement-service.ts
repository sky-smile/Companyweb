import { http, unwrapResponse } from './http';
import { AnnouncementListResult, CreateAnnouncementPayload } from '../types/announcement';

export const announcementService = {
  list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return unwrapResponse<AnnouncementListResult>(http.get('/admin/announcements', { params }));
  },

  create(payload: CreateAnnouncementPayload) {
    return unwrapResponse(http.post('/admin/announcements', payload));
  },
};
