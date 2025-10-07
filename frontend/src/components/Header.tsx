import { makeStyles } from '@fluentui/react-components';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';

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
  const { setUserInfo } = useContext(UserContext);

  const logout = () => {
    setUserInfo(null);
    navigate('/');
  };

  return (
    <div className={styles.header}>
      <span>MicroPost</span>
      <span>UserName</span>
      <span onClick={logout}>ログアウト</span>
    </div>
  );
};
