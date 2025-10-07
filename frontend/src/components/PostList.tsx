import { useContext, useEffect } from 'react';
import { fetchPosts } from '../api/posts';
import { PostListContext, type PostType } from '../contexts/PostListContext';
import { UserContext } from '../contexts/UserContext';
import { Post } from './Post';

export const PostList = () => {
  const { postList, setPostList } = useContext(PostListContext);
  const { userInfo } = useContext(UserContext);

  const fetchPostList = async () => {
    if (!userInfo) return;
    const fetchPostsResult = await fetchPosts(userInfo.token, {
      offset: 0,
      limit: 20,
    });

    console.log(fetchPostsResult);
    if (!fetchPostsResult.success) {
      console.error('Failed to fetch posts:', fetchPostsResult.error);
      return;
    }

    if (!fetchPostsResult.data) {
      console.error('data is falsy');
      return;
    }

    setPostList(
      fetchPostsResult.data.map(
        (post: any): PostType => ({
          id: post.id,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          user: {
            id: post.user.id,
            username: post.user.username,
          },
        }),
      ),
    );
  };

  useEffect(() => {
    fetchPostList();
  }, []);

  return (
    <div>
      <p>PostList</p>

      {postList.map((p) => (
        <Post key={p.id} post={p} />
      ))}
    </div>
  );
};
