import {
  Button,
  Input,
  Label,
  makeStyles,
  useId,
} from '@fluentui/react-components';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createUser } from '../api/users';

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
  errorMessage: {
    color: 'red',
    fontSize: '14px',
  },
});

export const SignUpForm = () => {
  const styles = useStyles();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSignUpClick = async () => {
    setError(null);

    const result = await createUser(credentials);
    if (result.success && result.data) {
      navigate('/');
    } else {
      setError(result.error?.message || 'ユーザー登録に失敗しました');
    }
  };

  const usernameInputId = useId('username');
  const passwordInputId = useId('password');
  const emailInputId = useId('email');

  return (
    <div className={styles.formContainer}>
      <div className={styles.formField}>
        <Label htmlFor={usernameInputId} size='medium'>
          ユーザー名
        </Label>
        <Input
          id={usernameInputId}
          value={credentials.username}
          onChange={(e) => {
            setCredentials({ ...credentials, username: e.target.value });
          }}
        />
      </div>

      <div className={styles.formField}>
        <Label htmlFor={passwordInputId} size='medium'>
          パスワード
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

      <div className={styles.formField}>
        <Label htmlFor={emailInputId} size='medium'>
          メールアドレス
        </Label>
        <Input
          id={emailInputId}
          type='email'
          value={credentials.email}
          onChange={(e) => {
            setCredentials({ ...credentials, email: e.target.value });
          }}
        />
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.submitButton}>
        <Button
          appearance='primary'
          icon={<UserPlus />}
          onClick={onSignUpClick}
        >
          登録
        </Button>
      </div>
    </div>
  );
};
