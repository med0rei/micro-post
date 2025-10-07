import { Button, Input, Label, useId } from '@fluentui/react-components';
import { LogIn } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { type SignInResult, signIn } from '../api/auth';
import { UserContext } from '../contexts/UserContext';

export const SignInForm = () => {
  const userContext = useContext(UserContext);
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const navigate = useNavigate();

  const onSignInClick = async () => {
    console.log('onSignInClick');
    const result: SignInResult = await signIn(
      credentials.userId,
      credentials.password,
    );
    if (result.success) {
      console.log('Sign-in successful:', result.data);
      userContext.setUserInfo({
        userId: result.data.userId,
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
