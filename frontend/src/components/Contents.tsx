import { makeStyles } from '@fluentui/react-components';
import { PostList } from './PostList';

const useStyles = makeStyles({
  contents: {
    height: '100%',
    marginLeft: '30%',
    overflowY: 'auto',
    width: '70%',
  },
});

export const Contents = () => {
  const styles = useStyles();
  return (
    <div className={styles.contents}>
      <PostList />
    </div>
  );
};
