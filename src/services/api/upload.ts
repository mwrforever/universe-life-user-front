/**
 * 文件上传API服务
 * 提供图片、文件上传功能
 */

import { httpClient } from '../http/client';
import type { UploadResponse, ApiResponse } from '../types/api';

/**
 * 文件上传API服务类
 */
export class UploadApiService {
  /**
   * 上传图片
   */
  static async uploadImage(
    file: File,
    onProgress?: (progress: number) => void,
    category?: 'avatar' | 'service' | 'task' | 'evidence' | 'other'
  ): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    if (category) {
      formData.append('category', category);
    }

    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      };

      httpClient.getAxiosInstance()
        .post('/api/upload/image', formData, config)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * 上传文件
   */
  static async uploadFile(
    file: File,
    onProgress?: (progress: number) => void,
    category?: 'document' | 'contract' | 'certificate' | 'other'
  ): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    if (category) {
      formData.append('category', category);
    }

    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      };

      httpClient.getAxiosInstance()
        .post('/api/upload/file', formData, config)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * 批量上传图片
   */
  static async uploadImages(
    files: File[],
    onProgress?: (progress: number, currentIndex: number, total: number) => void,
    category?: 'service' | 'task' | 'evidence' | 'other'
  ): Promise<ApiResponse<UploadResponse[]>> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, (progress) => {
        if (onProgress) {
          const overallProgress = Math.round(((index * 100) + progress) / files.length);
          onProgress(overallProgress, index + 1, files.length);
        }
      }, category)
    );

    try {
      const results = await Promise.all(uploadPromises);
      return {
        code: 0,
        message: '批量上传成功',
        data: results.map(result => result.data),
        timestamp: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取上传预签名URL（用于直接上传到云存储）
   */
  static async getUploadPresignedUrl(params: {
    filename: string;
    fileType: string;
    fileSize: number;
    category?: string;
  }): Promise<ApiResponse<{
    uploadUrl: string;
    fileUrl: string;
    fileId: string;
    expiresIn: number;
  }>> {
    return httpClient.post('/api/upload/presigned-url', params);
  }

  /**
   * 使用预签名URL上传文件到云存储
   */
  static async uploadToCloudStorage(
    uploadUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (onProgress && event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`上传失败: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('网络错误'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  /**
   * 删除已上传的文件
   */
  static async deleteFile(fileId: string): Promise<ApiResponse<null>> {
    return httpClient.delete(`/api/upload/files/${fileId}`);
  }

  /**
   * 获取文件信息
   */
  static async getFileInfo(fileId: string): Promise<ApiResponse<UploadResponse>> {
    return httpClient.get(`/api/upload/files/${fileId}`);
  }

  /**
   * 验证文件类型和大小
   */
  static validateFile(file: File, options?: {
    maxSize?: number; // 最大文件大小（字节）
    allowedTypes?: string[]; // 允许的文件类型
    allowedExtensions?: string[]; // 允许的文件扩展名
  }): { valid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 默认10MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    } = options || {};

    // 检查文件大小
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `文件大小不能超过 ${(maxSize / 1024 / 1024).toFixed(1)}MB`
      };
    }

    // 检查文件类型
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: '不支持的文件类型'
      };
    }

    // 检查文件扩展名
    if (allowedExtensions.length > 0) {
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (!allowedExtensions.includes(extension)) {
        return {
          valid: false,
          error: '不支持的文件扩展名'
        };
      }
    }

    return { valid: true };
  }

  /**
   * 压缩图片（使用浏览器Canvas API）
   */
  static async compressImage(
    file: File,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number; // 0-1
      format?: 'jpeg' | 'png' | 'webp';
    }
  ): Promise<File> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options || {};

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 计算压缩后的尺寸
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制压缩后的图片
        ctx?.drawImage(img, 0, 0, width, height);

        // 转换为Blob
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('图片压缩失败'));
          }
        }, `image/${format}`, quality);
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export default UploadApiService;