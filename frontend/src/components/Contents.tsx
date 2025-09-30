import { makeStyles } from '@fluentui/react-components';
import { PostList } from './PostList';

const useStyles = makeStyles({
  contents: {
    border: '2px solid #FF00FF',
    width: '100%',
    height: '100%',
  },
});

export const Contents = () => {
  const styles = useStyles();
  return (
    <div className={styles.contents}>
      <PostList></PostList>
    </div>
  );
};
