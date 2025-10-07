import { Button, makeStyles, Textarea } from '@fluentui/react-components';
import { Send } from 'lucide-react';
import { useContext, useState } from 'react';
import { createPost, fetchPosts } from '../api/posts';
import { PostListContext, type PostType } from '../contexts/PostListContext';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles({
  sidebar: {
    border: '2px solid blue',
    width: '30%',
    height: '100%',
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

  const onSendClick = async () => {
    if (!userInfo) {
      console.error('User not signed in');
      return;
    }

    await createPost(userInfo.token, message);
    setMessage('');
    await fetchPostList();
  };

  return (
    <div className={styles.sidebar}>
      <div>hoge</div>
      <div>hoge@example.com</div>

      <div>
        <Textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></Textarea>
      </div>

      <div>
        <Button appearance='primary' icon={<Send />} onClick={onSendClick}>
          送信
        </Button>
      </div>
    </div>
  );
};
