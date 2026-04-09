import { http, unwrapResponse } from './http';
import { UploadedFileItem } from '../types/upload';

async function upload(endpoint: '/admin/upload/image' | '/admin/upload/file', file: File, folder: string) {
  const formData = new FormData();
  formData.append('file', file);

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
};
