import axios, { AxiosError } from 'axios';
import { API_HOST } from './constants';

const BASE_URL = `${API_HOST}/posts`;

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

export type CreatePostResult = ApiResult<Post>;
export type GetPostsResult = ApiResult<Post[]>;

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

function handleApiError(error: unknown): ApiError {
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
}

function createAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const createPost = async (
  token: string,
  content: string,
): Promise<CreatePostResult> => {
  try {
    const response = await axios.post<Post>(
      BASE_URL,
      { content },
      { headers: createAuthHeaders(token) },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

export const fetchPosts = async (
  token: string,
  { offset = 0, limit = 10 }: { offset?: number; limit?: number } = {},
): Promise<GetPostsResult> => {
  try {
    const response = await axios.get<Post[]>(BASE_URL, {
      headers: createAuthHeaders(token),
      params: { offset, limit },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};
