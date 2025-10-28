import {
  Button,
  Input,
  Label,
  Link,
  makeStyles,
  useId,
} from '@fluentui/react-components';
import { LogIn } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../api/auth';
import { fetchUser } from '../api/users';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles({
  formContainer: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    margin: '0 auto',
    padding: '20px',
    maxWidth: '400px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  submitButton: {
    alignSelf: 'flex-end',
  },
  signUpLink: {
    textAlign: 'center',
    fontSize: '14px',
  },
});

export const SignInForm = () => {
  const styles = useStyles();
  const userContext = useContext(UserContext);
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const navigate = useNavigate();

  const onSignInClick = async () => {
    console.log('onSignInClick');
    const result = await signIn(credentials.userId, credentials.password);
    if (result.success && result.data) {
      console.log('Sign-in successful:', result.data);
      userContext.setUserInfo({
        userId: result.data.userId,
        username: await fetchUser(result.data.userId).then((res) => {
          if (res.success && res.data) {
            return res.data.username;
          } else {
            return '';
          }
        }),
        token: result.data.token,
      });
      navigate('/main');
    } else {
      console.error('Sign-in failed:', result.error);
    }
  };

  const idInputId = useId('id');
  const passwordInputId = useId('password');

  return (
    <div className={styles.formContainer}>
      <div className={styles.formField}>
        <Label htmlFor={idInputId} size='medium'>
          ID
        </Label>
        <Input
          id={idInputId}
          value={credentials.userId}
          onChange={(e) => {
            setCredentials({ ...credentials, userId: e.target.value });
          }}
        />
      </div>

      <div className={styles.formField}>
        <Label htmlFor={passwordInputId} size='medium'>
          Password
        </Label>
        <Input
          id={passwordInputId}
          type='password'
          value={credentials.password}
          onChange={(e) => {
            setCredentials({ ...credentials, password: e.target.value });
          }}
        />
      </div>

      <div className={styles.submitButton}>
        <Button appearance='primary' icon={<LogIn />} onClick={onSignInClick}>
          Login
        </Button>
      </div>

      <div className={styles.signUpLink}>
        新規登録は <Link onClick={() => navigate('/signup')}>こちら</Link>
      </div>
    </div>
  );
};
