import { useContext, useState } from 'react';
import { Navigate } from 'react-router';
import { Body } from '../components/Body';
import { Contents } from '../components/Contents';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { PostListContext, type PostType } from '../contexts/PostListContext';
import { UserContext } from '../contexts/UserContext';

export const Main = () => {
  const { userInfo } = useContext(UserContext);
  const [postList, setPostList] = useState<PostType[]>([]);

  if (!userInfo) {
    return <Navigate replace to='/' />;
  }

  return (
    <PostListContext value={{ postList, setPostList }}>
      <Header />
      <Body>
        <Sidebar />
        <Contents />
      </Body>
    </PostListContext>
  );
};
