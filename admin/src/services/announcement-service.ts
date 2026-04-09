import { http, unwrapResponse } from './http';
import { AnnouncementItem, AnnouncementListResult, CreateAnnouncementPayload, UpdateAnnouncementPayload } from '../types/announcement';

export const announcementService = {
  list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return unwrapResponse<AnnouncementListResult>(http.get('/admin/announcements', { params }));
  },

  create(payload: CreateAnnouncementPayload) {
    return unwrapResponse<AnnouncementItem>(http.post('/admin/announcements', payload));
  },

  detail(id: string) {
    return unwrapResponse<AnnouncementItem>(http.get(`/admin/announcements/${id}`));
  },

  update(id: string, payload: UpdateAnnouncementPayload) {
    return unwrapResponse<AnnouncementItem>(http.patch(`/admin/announcements/${id}`, payload));
  },

  delete(id: string) {
    return unwrapResponse(http.delete(`/admin/announcements/${id}`));
  },
};
