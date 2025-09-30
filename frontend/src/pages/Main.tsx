import { Contents } from '../components/Contents';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export const Main = () => {
  return (
    <>
      <Header />
      <Sidebar></Sidebar>
      <Contents />
    </>
  );
};
