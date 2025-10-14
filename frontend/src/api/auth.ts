import axios from 'axios';
import { API_HOST } from './constants';
import { type ApiResult, handleApiError } from './utils';

export interface SignInData {
  userId: number;
  token: string;
}

export const signIn = async (
  username: string,
  password: string,
): Promise<ApiResult<SignInData>> => {
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
    const apiError = handleApiError(error);

    // 401エラーの場合はメッセージをカスタマイズ
    if (apiError.status === 401) {
      apiError.message = 'ユーザー名またはパスワードが間違っています';
    }

    return {
      success: false,
      error: apiError,
    };
  }
};
