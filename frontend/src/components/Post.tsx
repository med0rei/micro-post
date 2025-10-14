import type { JSXElement } from '@fluentui/react-components';
import {
  Body1,
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  makeStyles,
  Text,
} from '@fluentui/react-components';
import {
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  HeartPlus,
  Repeat2,
  Reply,
  UserPlus,
} from 'lucide-react';
import { format } from 'date-fns';
import type { PostType } from '../contexts/PostListContext';

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
        description={<Caption1>{format(new Date(post.createdAt), 'yyyy/MM/dd HH:mm:ss')}</Caption1>}
        action={
          <Button
            appearance='transparent'
            icon={<EllipsisVertical />}
            aria-label='More options'
          />
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
    </Card>
  );
};
