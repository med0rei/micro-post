import {
  Body1,
  Caption1,
  Card,
  makeStyles,
  Title3,
} from '@fluentui/react-components';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchUser, type UserInfo } from '../api/users';

const useStyles = makeStyles({
  container: {
    display: 'flex',
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
      <UserPosts />
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

const UserPosts = () => {
  return <div>User Posts Section</div>;
};
