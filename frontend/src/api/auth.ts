import axios from 'axios';
import { API_HOST } from './constants';
import { type ApiResult, createAuthHeaders, handleApiError } from './utils';

export interface SignInData {
  userId: number;
  token: string;
}

const BASE_URL = `${API_HOST}/auth`;

export const signIn = async (
  username: string,
  password: string,
): Promise<ApiResult<SignInData>> => {
  const URL = `${BASE_URL}/login`;

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

export const logout = async (token: string): Promise<ApiResult<null>> => {
  const URL = `${BASE_URL}/logout`;

  try {
    await axios.delete(URL, {
      headers: createAuthHeaders(token),
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};
