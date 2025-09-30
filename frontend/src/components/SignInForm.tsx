import { Button, Input, Label, useId } from '@fluentui/react-components';
import { LogIn } from 'lucide-react';

export const SignInForm = () => {
  const idInputId = useId('id');
  const passwordInputId = useId('password');

  return (
    <div>
      <div>
        <Label htmlFor={idInputId} size='medium'>
          ID
        </Label>
        <Input id={idInputId} />
      </div>

      <div>
        <Label htmlFor={passwordInputId} size='medium'>
          Password
        </Label>
        <Input id={passwordInputId} type='password' />
      </div>

      <div>
        <Button appearance='primary' icon={<LogIn />}>
          Login
        </Button>
      </div>
    </div>
  );
};
