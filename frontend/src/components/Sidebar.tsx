import { Button, makeStyles, Textarea } from '@fluentui/react-components';
import { Send } from 'lucide-react';
import { useContext, useState } from 'react';
import { createPost } from '../api/posts';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles({
  sidebar: {
    border: '2px solid blue',
    width: '30%',
    height: '100%',
  },
});

export const Sidebar = () => {
  const styles = useStyles();
  const { userInfo } = useContext(UserContext);
  const [message, setMessage] = useState('');

  const onSendClick = () => {
    if (!userInfo) {
      console.error('User not signed in');
      return;
    }

    createPost(userInfo.token, message);
    setMessage('');
  };

  return (
    <div className={styles.sidebar}>
      <div>hoge</div>
      <div>hoge@example.com</div>

      <div>
        <Textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></Textarea>
      </div>

      <div>
        <Button appearance='primary' icon={<Send />} onClick={onSendClick}>
          送信
        </Button>
      </div>
    </div>
  );
};
