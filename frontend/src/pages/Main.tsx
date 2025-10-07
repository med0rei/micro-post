import { useState } from 'react';
import { Body } from '../components/Body';
import { Contents } from '../components/Contents';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { PostListContext, type PostType } from '../contexts/PostListContext';

export const Main = () => {
  const [postList, setPostList] = useState<PostType[]>([]);

  return (
    <PostListContext value={{ postList, setPostList }}>
      <Header />
      <Body>
        <Sidebar></Sidebar>
        <Contents />
      </Body>
    </PostListContext>
  );
};
