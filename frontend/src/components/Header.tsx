import { Button, makeStyles, Text, Title2 } from '@fluentui/react-components';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { logout } from '../api/auth';
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
  const { userInfo, setUserInfo } = useContext(UserContext);

  const myLogout = () => {
    setUserInfo(null);
    if (userInfo) {
      logout(userInfo.token);
    }
    navigate('/');
  };

  return (
    <div className={styles.header}>
      <span className={styles.headerLeft}>
        <Link to='/main' style={{ color: 'inherit', textDecoration: 'none' }}>
          <Title2>MicroPost</Title2>
        </Link>
      </span>

      <span className={styles.headerRight}>
        <Text>{userInfo?.username}</Text>
        <Button onClick={myLogout}>ログアウト</Button>
      </span>
    </div>
  );
};
