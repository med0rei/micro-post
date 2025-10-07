import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { UserContext, type UserInfo } from './contexts/UserContext';
import { Main } from './pages/Main';
import { SignIn } from './pages/SignIn';

import './App.css';

export const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);

  return (
    <div className='App'>
      <UserContext value={{ userInfo, setUserInfo }}>
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route path='/main' element={<Main />} />
        </Routes>
      </UserContext>
    </div>
  );
};
