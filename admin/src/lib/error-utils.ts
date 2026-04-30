import { isAxiosError } from 'axios';

/**
 * 从错误对象中提取错误消息
 * 支持 Error、AxiosError 和未知类型的错误
 */
export function getErrorMessage(error: unknown, fallback = '操作失败'): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}

/**
 * 检查错误是否为表单验证错误
 */
export function isFormValidationError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errorFields' in error
  );
}
