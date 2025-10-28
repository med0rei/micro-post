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

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface CreateUserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type FetchUserResult = ApiResult<UserInfo>;
export type CreateUserResult = ApiResult<CreateUserResponse>;

export const fetchUser = async (userId: number): Promise<FetchUserResult> => {
  const API_URL = `${BASE_URL}/${userId}`;

  try {
    const response = await axios.get<UserInfo>(API_URL);

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

export const createUser = async (
  userData: CreateUserRequest,
): Promise<CreateUserResult> => {
  try {
    const response = await axios.post<CreateUserResponse>(BASE_URL, userData);

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
