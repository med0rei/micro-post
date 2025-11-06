import {
  Body1,
  Button,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  Title3,
  Toast,
  ToastTitle,
  useId,
  useToastController,
} from '@fluentui/react-components';
import { format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Pencil,
} from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchPosts } from '../api/posts';
import {
  fetchUser,
  type UpdateUserRequest,
  type UserInfo,
  updateUser,
} from '../api/users';
import type { Post as PostData } from '../api/utils';
import { ToasterContext } from '../contexts/ToasterContext';
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
  cardPreview: {
    marginBottom: '5px',
    marginLeft: '20px',
    marginTop: '5px',
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
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  errorMessage: {
    color: '#d13438',
    fontSize: '14px',
    marginTop: '8px',
  },
});

export const UserPage = () => {
  const styles = useStyles();
  const params = useParams();
  const userId = Number(params.userId);
  const { userInfo } = useContext(UserContext);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const result = await fetchUser(userId, userInfo?.token);
      if (result.success && result.data) {
        setUser(result.data);
      }
    };

    loadUser();
  }, [userId, userInfo?.token]);

  return (
    <div className={styles.container}>
      <UserProfile user={user} setUser={setUser} />
      <UserPosts userId={userId} />
    </div>
  );
};

const UserProfile = ({
  user,
  setUser,
}: {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
}) => {
  const styles = useStyles();
  const { userInfo } = useContext(UserContext);
  const { toasterId } = useContext(ToasterContext);
  const { dispatchToast } = useToastController(toasterId);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameInputId = useId('username');
  const emailInputId = useId('email');

  if (!user) return null;

  const isOwnAccount = userInfo?.userId === user.id;

  const handleUpdateUser = async () => {
    if (!userInfo || !user) return;

    setError(null);
    setIsSubmitting(true);

    // 更新するフィールドのみ送信
    const updateData: UpdateUserRequest = {};
    if (editData.username && editData.username !== user.username) {
      updateData.username = editData.username;
    }
    if (editData.email && editData.email !== (user.email || '')) {
      updateData.email = editData.email;
    }

    // 何も変更されていない場合
    if (Object.keys(updateData).length === 0) {
      setError('変更する項目を入力してください');
      setIsSubmitting(false);
      return;
    }

    const result = await updateUser(userInfo.token, user.id, updateData);

    setIsSubmitting(false);

    if (result.success && result.data) {
      setUser({
        ...user,
        username: result.data.username,
        email: result.data.email,
        updatedAt: result.data.updatedAt,
      });

      if (updateData.username) {
        userInfo.username = updateData.username;
      }

      dispatchToast(
        <Toast>
          <ToastTitle>プロフィールを更新しました</ToastTitle>
        </Toast>,
        { intent: 'success' },
      );

      setIsEditDialogOpen(false);
    } else {
      setError(result.error?.message || '更新に失敗しました');
    }
  };

  return (
    <Card className={styles.profileCard}>
      <CardHeader
        image={<img alt={`${user.username} avatar`} />}
        header={
          <Body1>
            <b>{user.username}</b>
            <div>@{user.username}</div>
          </Body1>
        }
        action={
          <Menu>
            <MenuTrigger>
              <Button
                appearance='transparent'
                icon={<EllipsisVertical />}
                aria-label='More options'
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                {isOwnAccount && (
                  <MenuItem
                    icon={<Pencil />}
                    onClick={() => {
                      setEditData({
                        username: user.username,
                        email: user.email || '',
                      });
                      setError(null);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    編集
                  </MenuItem>
                )}
              </MenuList>
            </MenuPopover>
          </Menu>
        }
      />
      <CardPreview className={styles.cardPreview}>
        <div>
          <Caption1 className={styles.joinDate}>
            登録日: {format(new Date(user.createdAt), 'yyyy年MM月dd日')}
          </Caption1>
        </div>
      </CardPreview>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(_, data) => {
          setIsEditDialogOpen(data.open);
          if (!data.open) {
            setError(null);
          }
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              <Pencil /> プロフィール編集
            </DialogTitle>
            <DialogContent>
              <div className={styles.formField}>
                <Label htmlFor={usernameInputId}>ユーザー名</Label>
                <Input
                  id={usernameInputId}
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                />
              </div>

              <div className={styles.formField}>
                <Label htmlFor={emailInputId}>メールアドレス</Label>
                <Input
                  id={emailInputId}
                  type='email'
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance='secondary' disabled={isSubmitting}>
                  キャンセル
                </Button>
              </DialogTrigger>
              <Button
                appearance='primary'
                onClick={handleUpdateUser}
                disabled={isSubmitting}
              >
                {isSubmitting ? '更新中…' : '保存'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
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
