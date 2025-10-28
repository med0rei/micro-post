import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { Toaster, useId } from '@fluentui/react-components';
import { ToasterContext } from './contexts/ToasterContext';
import { UserContext, type UserInfo } from './contexts/UserContext';
import { Main } from './pages/Main';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { User } from './pages/User';

import './App.css';

export const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const toasterId = useId('toaster');

  return (
    <div className='App'>
      <Toaster toasterId={toasterId} />
      <ToasterContext value={{ toasterId }}>
        <UserContext value={{ userInfo, setUserInfo }}>
          <Routes>
            <Route path='/' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/main' element={<Main />} />
            <Route path='/users/:userId' element={<User />} />
          </Routes>
        </UserContext>
      </ToasterContext>
    </div>
  );
};
