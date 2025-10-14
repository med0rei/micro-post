import axios from 'axios';
import { API_HOST } from './constants';
import { type ApiResult, createAuthHeaders, handleApiError } from './utils';

const BASE_URL = `${API_HOST}/users`;

export interface UserInfo {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export type FetchUserResult = ApiResult<UserInfo>;

export const fetchUser = async (
  token: string,
  userId: number,
): Promise<FetchUserResult> => {
  const API_URL = `${BASE_URL}/${userId}`;

  try {
    const response = await axios.get<UserInfo>(API_URL, {
      headers: createAuthHeaders(token),
      params: { userId },
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
