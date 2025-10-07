import { createContext, type Dispatch, type SetStateAction } from 'react';

export type PostType = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
  };
};

type PostListContextType = {
  postList: PostType[];
  setPostList: Dispatch<SetStateAction<PostType[]>>;
};

export const PostListContext = createContext<PostListContextType>(
  {} as PostListContextType,
);
