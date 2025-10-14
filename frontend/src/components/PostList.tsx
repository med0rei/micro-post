import { makeStyles, Title3 } from '@fluentui/react-components';
import { useContext, useEffect } from 'react';
import { fetchPosts } from '../api/posts';
import { PostListContext, type PostType } from '../contexts/PostListContext';
import { UserContext } from '../contexts/UserContext';
import { Post } from './Post';

const useStyles = makeStyles({
  header: {
    margin: '10px',
    padding: '10px',
    width: '720px',
  },
  postListContainer: {
    margin: '20px',
  },
  postList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: '10px',
  },
});

export const PostList = () => {
  const styles = useStyles();
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
      <div className={styles.header}>
        <Title3>PostList</Title3>
      </div>

      <div className={styles.postListContainer}>
        <div className={styles.postList}>
          {postList.map((p) => (
            <Post key={p.id} post={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
