export interface UploadedFileItem {
  originalName: string;
  mimeType: string;
  size: number;
  filename: string;
  storagePath: string;
  publicUrl: string;
}

export interface MediaFile {
  id: number;
  originalName: string;
  filename: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  size: number;
  extension: string;
  folder: string;
  width: number | null;
  height: number | null;
  thumbnailUrl: string | null;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
}
