import axios, { AxiosError } from 'axios';
import { API_HOST } from './constants';

export interface SignInResult {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code?: string;
    status?: number;
  };
}

export const signIn = async (
  username: string,
  password: string,
): Promise<SignInResult> => {
  const URL = `${API_HOST}/auth/login`;

  try {
    const response = await axios.post(URL, {
      username,
      password,
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
        401: 'ユーザー名またはパスワードが間違っています',
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
