import {
  Body1,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  makeStyles,
  Textarea,
} from '@fluentui/react-components';
import { Send } from 'lucide-react';
import { useContext, useState } from 'react';
import { createPost, fetchPosts } from '../api/posts';
import type { Post as PostData } from '../api/utils';
import { PostListContext, type PostType } from '../contexts/PostListContext';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles({
  sidebar: {
    backgroundColor: '#fff',
    borderRight: '1px solid #ccc',
    height: 'calc(100vh - 52px)',
    left: '0',
    overflowY: 'auto',
    padding: '10px',
    position: 'fixed',
    top: '52px',
    width: '30%',
    zIndex: '100',
  },
  card: {
    margin: 'auto',
    maxWidth: '100%',
    padding: '20px',
    width: '720px',
  },
  userInfo: {
    marginBottom: '10px',
  },
  textareaContainer: {
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
  },
  cardPreview: {
    margin: '0 10px',
  },
});

export const Sidebar = () => {
  const styles = useStyles();
  const { userInfo } = useContext(UserContext);
  const [message, setMessage] = useState('');

  const { setPostList } = useContext(PostListContext);

  const fetchPostList = async () => {
    if (!userInfo) return;
    const fetchPostsResult = await fetchPosts(userInfo.token, {
      offset: 0,
      limit: 10,
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
        (post: PostData): PostType => ({
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

  const onSendClick = async () => {
    if (!userInfo) {
      console.error('User not signed in');
      return;
    }

    await createPost(userInfo.token, message);
    setMessage('');
    await fetchPostList();
  };

  if (!userInfo) {
    return null;
  }

  return (
    <div className={styles.sidebar}>
      <Card className={styles.card}>
        <CardHeader
          className={styles.userInfo}
          image={<img alt={`${userInfo.username} avatar`} />}
          header={
            <Body1>
              <b>{userInfo.username}</b>
              <div>@{userInfo.username}</div>
            </Body1>
          }
        />

        <CardPreview className={styles.cardPreview}>
          <div>
            <Textarea
              className={styles.textarea}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></Textarea>
          </div>
        </CardPreview>

        <CardFooter>
          <Button
            appearance='primary'
            icon={<Send />}
            disabled={message.trim() === ''}
            onClick={onSendClick}
          >
            送信
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
