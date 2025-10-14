import { createContext, type Dispatch, type SetStateAction } from 'react';

export type UserInfo = {
  userId: number;
  username: string;
  token: string;
} | null;

type UserContextType = {
  userInfo: UserInfo;
  setUserInfo: Dispatch<SetStateAction<UserInfo>>;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);
