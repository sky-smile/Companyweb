import { http, unwrapResponse } from './http';
import { UploadedFileItem } from '../types/upload';

async function upload(endpoint: '/admin/upload/image' | '/admin/upload/file', file: File, folder: string) {
  const formData = new FormData();

  // 确保文件名正确编码，处理中文等特殊字符
  // 使用 file.name 作为原始文件名，浏览器会自动进行 UTF-8 编码
  console.log('[Upload] Original filename:', file.name);
  console.log('[Upload] File name bytes:', new TextEncoder().encode(file.name));
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
    return unwrapResponse(response);
  },
};
