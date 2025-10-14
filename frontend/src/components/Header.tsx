import { Button, makeStyles } from '@fluentui/react-components';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import { fetchUser } from '../api/users';

const useStyles = makeStyles({
  header: {
    width: '100%',
    height: '32px',
    border: '2px solid red',
  },
});

export const Header = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const { userInfo, setUserInfo } = useContext(UserContext);

  const logout = () => {
    setUserInfo(null);
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
      <span>MicroPost</span>
      <span>{username}</span>
      <Button onClick={logout}>ログアウト</Button>
    </div>
  );
};
