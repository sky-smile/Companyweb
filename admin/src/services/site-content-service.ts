import { http, unwrapResponse } from './http';
import {
  BannerItem,
  CreateBannerPayload,
  SitePageItem,
  SiteSettingItem,
  UpdateBannerPayload,
  UpdateSitePagePayload,
  UpdateSiteSettingsPayload,
} from '../types/site-content';

export const siteContentService = {
  getSitePage(key: string) {
    return unwrapResponse<SitePageItem>(http.get(`/admin/site-pages/${key}`));
  },

  updateSitePage(key: string, payload: UpdateSitePagePayload) {
    return unwrapResponse<SitePageItem>(http.put(`/admin/site-pages/${key}`, payload));
  },

  listSiteSettings() {
    return unwrapResponse<SiteSettingItem[]>(http.get('/admin/site-settings'));
  },

  updateSiteSettings(payload: UpdateSiteSettingsPayload) {
    return unwrapResponse<SiteSettingItem[]>(http.put('/admin/site-settings', payload));
  },

  listBanners() {
    return unwrapResponse<BannerItem[]>(http.get('/admin/banners'));
  },

  createBanner(payload: CreateBannerPayload) {
    return unwrapResponse<BannerItem>(http.post('/admin/banners', payload));
  },

  updateBanner(id: string, payload: UpdateBannerPayload) {
    return unwrapResponse<BannerItem>(http.patch(`/admin/banners/${id}`, payload));
  },

  deleteBanner(id: string) {
    return unwrapResponse(http.delete(`/admin/banners/${id}`));
  },

  updateBannerStatus(id: string, status: number) {
    return unwrapResponse<BannerItem>(http.patch(`/admin/banners/${id}`, { status }));
  },
};
