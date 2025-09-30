import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  header: {
    width: '100%',
    height: '32px',
    border: '2px solid red',
  },
});

export const Header = () => {
  const styles = useStyles();
  return <div className={styles.header}>Header</div>;
};
