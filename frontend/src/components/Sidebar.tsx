import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  sidebar: {
    border: '2px solid blue',
    width: '30%',
    height: '100%',
  },
});

export const Sidebar = () => {
  const styles = useStyles();
  return <div className={styles.sidebar}>Sidebar</div>;
};
