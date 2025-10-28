import axios from 'axios';
import { API_HOST } from './constants';
import {
  type ApiResult,
  type Post,
  createAuthHeaders,
  handleApiError,
} from './utils';

const BASE_URL = `${API_HOST}/posts`;

export type CreatePostResult = ApiResult<Post>;
export type GetPostsResult = ApiResult<Post[]>;
export type DeletePostResult = ApiResult<{ postId: number }>;

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
  {
    offset = 0,
    limit = 10,
    query,
  }: { offset?: number; limit?: number; query?: string } = {},
): Promise<GetPostsResult> => {
  try {
    const params: Record<string, number | string> = { offset, limit };
    const trimmedQuery = query?.trim();

    if (trimmedQuery) {
      params.query = trimmedQuery;
    }

    const response = await axios.get<Post[]>(BASE_URL, {
      headers: createAuthHeaders(token),
      params,
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

export const deletePost = async (
  token: string,
  postId: number,
): Promise<DeletePostResult> => {
  try {
    const response = await axios.delete<{ postId: number }>(
      `${BASE_URL}/${postId}`,
      {
        headers: createAuthHeaders(token),
      },
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
