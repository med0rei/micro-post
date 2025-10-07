import axios, { AxiosError } from 'axios';
import { API_HOST } from './constants';

const BASE_URL = `${API_HOST}/posts`;

export interface CreatePostResult {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code?: string;
    status?: number;
  };
}
export interface GetPostsResult {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code?: string;
    status?: number;
  };
}

export const createPost = async (
  token: string,
  content: string,
): Promise<CreatePostResult> => {
  const URL = BASE_URL;

  try {
    const response = await axios.post(
      URL,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (!axiosError.response) {
        return {
          success: false,
          error: {
            message: 'サーバーに接続できません',
            code: 'NETWORK_ERROR',
          },
        };
      }
      const status = axiosError.response.status;

      const statusMessages: Record<number, string> = {
        401: 'アクセストークンが間違っています',
        404: 'サービスが見つかりません',
        500: 'サーバーエラーが発生しました',
      };

      return {
        success: false,
        error: {
          message: statusMessages[status] ?? `エラーが発生しました (${status})`,
          status,
          code: 'SERVER_ERROR',
        },
      };
    }

    // その他のエラー
    return {
      success: false,
      error: {
        message: '予期しないエラーが発生しました',
        code: 'UNKNOWN_ERROR',
      },
    };
  }
};

export const fetchPosts = async (
  token: string,
  {
    offset = 0,
    limit = 10,
  }: {
    offset: number;
    limit: number;
  },
): Promise<GetPostsResult> => {
  const URL = BASE_URL;

  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { offset, limit },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (!axiosError.response) {
        return {
          success: false,
          error: {
            message: 'サーバーに接続できません',
            code: 'NETWORK_ERROR',
          },
        };
      }
      const status = axiosError.response.status;

      const statusMessages: Record<number, string> = {
        401: 'アクセストークンが間違っています',
        404: 'サービスが見つかりません',
        500: 'サーバーエラーが発生しました',
      };

      return {
        success: false,
        error: {
          message: statusMessages[status] ?? `エラーが発生しました (${status})`,
          status,
          code: 'SERVER_ERROR',
        },
      };
    }

    // その他のエラー
    return {
      success: false,
      error: {
        message: '予期しないエラーが発生しました',
        code: 'UNKNOWN_ERROR',
      },
    };
  }
};
