import { Button, makeStyles, Text, Title2 } from '@fluentui/react-components';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../api/auth';
import { fetchUser } from '../api/users';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles({
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ccc',
    display: 'flex',
    flexDirection: 'row',
    height: '32px',
    justifyContent: 'space-between',
    left: '0',
    padding: '10px 0px',
    position: 'fixed',
    right: '0',
    top: '0',
    width: '100%',
    zIndex: '1000',
  },
  headerLeft: {
    alignItems: 'center',
    display: 'flex',
    gap: '10px',
    margin: '0 20px',
  },
  headerRight: {
    alignItems: 'center',
    display: 'flex',
    gap: '10px',
    padding: '0 20px',
  },
});

export const Header = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const { userInfo, setUserInfo } = useContext(UserContext);

  const myLogout = () => {
    setUserInfo(null);
    if (userInfo) {
      logout(userInfo.token);
    }
    navigate('/');
  };

  useEffect(() => {
    const myFetchUser = async () => {
      if (!userInfo) return;
      const apiResult = await fetchUser(userInfo.token, userInfo.userId);
      if (!apiResult.success || !apiResult.data) {
        console.error(apiResult.error);
        return;
      }
      setUsername(apiResult.data.username);
    };
    myFetchUser();
  }, []);

  return (
    <div className={styles.header}>
      <span className={styles.headerLeft}>
        <Title2>MicroPost</Title2>
      </span>

      <span className={styles.headerRight}>
        <Text>{username}</Text>
        <Button onClick={myLogout}>ログアウト</Button>
      </span>
    </div>
  );
};
