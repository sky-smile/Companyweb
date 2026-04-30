import { http, unwrapResponse } from './http';
import { UploadedFileItem } from '../types/upload';

async function upload(endpoint: '/admin/upload/image' | '/admin/upload/file', file: File, folder: string) {
  const formData = new FormData();

  // 确保文件名正确编码，处理中文等特殊字符
  formData.append('file', file, file.name);

  return unwrapResponse<UploadedFileItem>(
    http.post(`${endpoint}?folder=${encodeURIComponent(folder)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}

export const uploadService = {
  uploadImage(file: File, folder: string) {
    return upload('/admin/upload/image', file, folder);
  },

  uploadFile(file: File, folder: string) {
    return upload('/admin/upload/file', file, folder);
  },

  async getFiles(
    page: number = 1,
    limit: number = 20,
    options?: {
      folder?: string;
      type?: string;
      keyword?: string;
    },
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(options?.folder && { folder: options.folder }),
      ...(options?.type && { type: options.type }),
      ...(options?.keyword && { keyword: options.keyword }),
    });

    const response = await http.get(`/admin/upload/files?${params.toString()}`);
    return unwrapResponse(response);
  },

  async getFile(id: number) {
    const response = await http.get(`/admin/upload/files/${id}`);
    return unwrapResponse(response);
  },

  async deleteFile(id: number) {
    const response = await http.delete(`/admin/upload/files/${id}`);
    return unwrapResponse(response);
  },

  async getStatistics() {
    const response = await http.get('/admin/upload/statistics');
    return unwrapResponse<{
      total: number;
      images: number;
      documents: number;
      others: number;
      byFolder: { folder: string; count: number }[];
    }>(response);
  },
};
