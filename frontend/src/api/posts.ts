import axios from 'axios';
import { API_HOST } from './constants';
import type { ApiResult, Post } from './users';
import { createAuthHeaders, handleApiError } from './utils';

const BASE_URL = `${API_HOST}/posts`;

export type CreatePostResult = ApiResult<Post>;
export type GetPostsResult = ApiResult<Post[]>;

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
