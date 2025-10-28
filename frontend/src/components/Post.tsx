import { format } from 'date-fns';
import {
  Body1,
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  Toast,
  ToastTitle,
  ToastBody,
  useToastController,
  type JSXElement,
} from '@fluentui/react-components';
import {
  EllipsisVertical,
  ExternalLink,
  HeartPlus,
  Repeat2,
  Reply,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { deletePost } from '../api/posts';
import { PostListContext, type PostType } from '../contexts/PostListContext';
import { ToasterContext } from '../contexts/ToasterContext';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles({
  card: {
    margin: 'auto',
    maxWidth: '100%',
    padding: '20px',
    width: '720px',
  },
  cardPreview: {
    marginBottom: '5px',
    marginLeft: '20px',
    marginTop: '5px',
  },
});

export const Post = ({ post }: { post: PostType }): JSXElement => {
  const styles = useStyles();
  const { userInfo } = useContext(UserContext);
  const { postList, setPostList } = useContext(PostListContext);
  const { toasterId } = useContext(ToasterContext);
  const { dispatchToast } = useToastController(toasterId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!userInfo) return;

    const result = await deletePost(userInfo.token, post.id);

    if (result.success) {
      setPostList(postList.filter((p) => p.id !== post.id));
      setDeleteDialogOpen(false);
    } else {
      dispatchToast(
        <Toast>
          <ToastTitle>ポストの削除に失敗しました</ToastTitle>
          <ToastBody>{result.error}</ToastBody>
        </Toast>,
        { intent: 'error' },
      );
      setDeleteDialogOpen(false);
    }
  };

  const isOwnPost = userInfo?.userId === post.user.id;

  return (
    <Card className={styles.card}>
      <CardHeader
        image={<img alt={`${post.user.username} avatar`} />}
        header={
          <Body1>
            <b>{post.user.username}</b>
            <span>
              <Button
                appearance='transparent'
                icon={<UserPlus />}
                aria-label='Follow'
              />
            </span>
            <div>@{post.user.username}</div>
          </Body1>
        }
        description={
          <Caption1>
            {format(new Date(post.createdAt), 'yyyy/MM/dd HH:mm:ss')}
          </Caption1>
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
                {isOwnPost && (
                  <MenuItem
                    icon={<Trash2 />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    削除
                  </MenuItem>
                )}
              </MenuList>
            </MenuPopover>
          </Menu>
        }
      />

      <CardPreview>
        <Text className={styles.cardPreview}>{post.content}</Text>
      </CardPreview>

      <CardFooter>
        <Button icon={<Reply />}>Reply</Button>
        <Button icon={<HeartPlus />}>Like</Button>
        <Button icon={<Repeat2 />}>Repost</Button>
        <Button icon={<ExternalLink />}>Share</Button>
      </CardFooter>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(_, data) => setDeleteDialogOpen(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              <Trash2 /> ポストの削除
            </DialogTitle>
            <DialogContent>
              <p>このポストを削除しますか？ </p>
              <p>この操作は取り消せません。</p>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance='secondary'>キャンセル</Button>
              </DialogTrigger>
              <Button
                appearance='primary'
                style={{ backgroundColor: '#d13438' }}
                onClick={handleDeleteConfirm}
              >
                削除
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Card>
  );
};
