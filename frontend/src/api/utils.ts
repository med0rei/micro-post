import axios, { type AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code: string;
  status?: number;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface Post {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
  };
}

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

const ERROR_MESSAGES: Record<number, string> = {
  401: 'アクセストークンが間違っています',
  404: 'サービスが見つかりません',
  500: 'サーバーエラーが発生しました',
};

export const handleApiError = (error: unknown): ApiError => {
  if (!axios.isAxiosError(error)) {
    return {
      message: '予期しないエラーが発生しました',
      code: ERROR_CODES.UNKNOWN_ERROR,
    };
  }

  const axiosError = error as AxiosError;

  if (!axiosError.response) {
    return {
      message: 'サーバーに接続できません',
      code: ERROR_CODES.NETWORK_ERROR,
    };
  }

  const status = axiosError.response.status;
  const code =
    status === 401
      ? ERROR_CODES.UNAUTHORIZED
      : status === 404
        ? ERROR_CODES.NOT_FOUND
        : ERROR_CODES.SERVER_ERROR;

  return {
    message: ERROR_MESSAGES[status] ?? `エラーが発生しました (${status})`,
    status,
    code,
  };
};

export const createAuthHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
  };
};
