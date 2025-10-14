import { Button, Input, Label, useId } from '@fluentui/react-components';
import { LogIn } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../api/auth';
import { fetchUser } from '../api/users';
import { UserContext } from '../contexts/UserContext';

export const SignInForm = () => {
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
        username: await fetchUser(
          result.data.token || '',
          result.data.userId,
        ).then((res) => {
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
    <div>
      <div>
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

      <div>
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

      <div>
        <Button appearance='primary' icon={<LogIn />} onClick={onSignInClick}>
          Login
        </Button>
      </div>
    </div>
  );
};
