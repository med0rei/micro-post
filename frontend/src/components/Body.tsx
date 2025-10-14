import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 52px)',
    marginTop: '52px',
    width: '100%',
  },
});

export const Body = ({ children }) => {
  const styles = useStyles();
  return <div className={styles.body}>{children}</div>;
};
