import {
  Body1,
  Button,
  Caption1,
  Card,
  makeStyles,
  Title3,
} from '@fluentui/react-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchPosts } from '../api/posts';
import type { Post as PostData } from '../api/utils';
import { fetchUser, type UserInfo } from '../api/users';
import { UserContext } from '../contexts/UserContext';
import { Post } from './Post';

const useStyles = makeStyles({
  container: {
    flexDirection: 'column',
    gap: '20px',
    margin: '0 auto',
    maxWidth: '720px',
    padding: '20px',
    width: '100%',
  },
  profileCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
    padding: '24px',
  },
  displayName: {
    margin: '0',
  },
  username: {
    color: '#666',
  },
  joinDate: {
    color: '#888',
  },
  postsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  postList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  paginationContainer: {
    alignItems: 'center',
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    padding: '10px',
  },
  pageInfo: {
    fontSize: '14px',
    minWidth: '100px',
    textAlign: 'center',
  },
});

export const UserPage = () => {
  const styles = useStyles();
  const params = useParams();
  const userId = Number(params.userId);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const result = await fetchUser(userId);
      if (result.success && result.data) {
        setUser(result.data);
      }
    };

    loadUser();
  }, [userId]);

  return (
    <div className={styles.container}>
      <UserProfile user={user} />
      <UserPosts userId={userId} />
    </div>
  );
};

const UserProfile = ({ user }: { user: UserInfo | null }) => {
  const styles = useStyles();

  if (!user) return null;

  return (
    <Card className={styles.profileCard}>
      <Title3 className={styles.displayName}>{user.username}</Title3>
      <Body1 className={styles.username}>@{user.username}</Body1>
      <Caption1 className={styles.joinDate}>
        登録日: {format(new Date(user.createdAt), 'yyyy年MM月dd日')}
      </Caption1>
    </Card>
  );
};

const UserPosts = ({ userId }: { userId: number }) => {
  const styles = useStyles();
  const POSTS_PER_PAGE = 10;

  const { userInfo } = useContext(UserContext);
  const [posts, setPosts] = useState<
    Array<{
      id: number;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      user: { id: number; username: string };
    }>
  >([]);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const fetchUserPosts = useCallback(
    async (pageNumber: number) => {
      const offset: number = (pageNumber - 1) * POSTS_PER_PAGE;

      const fetchPostsResult = await fetchPosts(userInfo?.token, {
        offset,
        limit: POSTS_PER_PAGE,
        userId,
      });

      if (!fetchPostsResult.success) {
        console.error('Failed to fetch posts:', fetchPostsResult.error);
        return;
      }

      if (!fetchPostsResult.data) {
        console.error('data is falsy');
        return;
      }

      setPosts(
        fetchPostsResult.data.map((post: PostData) => ({
          id: post.id,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          user: {
            id: post.user.id,
            username: post.user.username,
          },
        })),
      );

      setHasNextPage(fetchPostsResult.data.length === POSTS_PER_PAGE);
    },
    [userInfo, userId],
  );

  const handlePreviousPage = () => {
    if (currentPageNumber > 1) {
      const newPageNumber = currentPageNumber - 1;
      setCurrentPageNumber(newPageNumber);
      fetchUserPosts(newPageNumber);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      const newPageNumber = currentPageNumber + 1;
      setCurrentPageNumber(newPageNumber);
      fetchUserPosts(newPageNumber);
    }
  };

  useEffect(() => {
    fetchUserPosts(1);
    setCurrentPageNumber(1);
  }, [fetchUserPosts]);

  return (
    <div className={styles.postsSection}>
      <Title3>投稿一覧</Title3>

      <div className={styles.paginationContainer}>
        <Button
          appearance='secondary'
          icon={<ChevronLeft />}
          disabled={currentPageNumber === 1}
          onClick={handlePreviousPage}
        >
          前のページ
        </Button>
        <div className={styles.pageInfo}>ページ{currentPageNumber}</div>
        <Button
          appearance='secondary'
          icon={<ChevronRight />}
          iconPosition='after'
          disabled={!hasNextPage}
          onClick={handleNextPage}
        >
          次のページ
        </Button>
      </div>

      <div className={styles.postList}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      <div className={styles.paginationContainer}>
        <Button
          appearance='secondary'
          icon={<ChevronLeft />}
          disabled={currentPageNumber === 1}
          onClick={handlePreviousPage}
        >
          前のページ
        </Button>
        <div className={styles.pageInfo}>ページ{currentPageNumber}</div>
        <Button
          appearance='secondary'
          icon={<ChevronRight />}
          iconPosition='after'
          disabled={!hasNextPage}
          onClick={handleNextPage}
        >
          次のページ
        </Button>
      </div>
    </div>
  );
};
