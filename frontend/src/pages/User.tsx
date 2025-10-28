import { Body } from '../components/Body';
import { Header } from '../components/Header';
import { UserPage } from '../components/UserPage';

export const User = () => {
  return (
    <>
      <Header />
      <Body>
        <UserPage />
      </Body>
    </>
  );
};
