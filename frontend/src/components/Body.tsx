import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  body: {
    width: '100%',
    height: 'calc(100vh - 32px)',
    border: '2px solid green',
    display: 'flex',
    flexDirection: 'row',
  },
});

export const Body = ({ children }) => {
  const styles = useStyles();
  return <div className={styles.body}>{children}</div>;
};
