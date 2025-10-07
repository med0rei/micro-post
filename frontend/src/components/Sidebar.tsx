import { Button, makeStyles, Textarea } from '@fluentui/react-components';
import { Send } from 'lucide-react';
import { useState } from 'react';

const useStyles = makeStyles({
  sidebar: {
    border: '2px solid blue',
    width: '30%',
    height: '100%',
  },
});

export const Sidebar = () => {
  const styles = useStyles();
  const [message, setMessage] = useState('');
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
        <Button appearance='primary' icon={<Send />}>
          送信
        </Button>
      </div>
    </div>
  );
};
