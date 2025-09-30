import React from 'react';
import { Routes, Route } from 'react-router';
import { Post } from './components/Post';
import { Main } from './pages/Main';
import { SignIn } from './pages/SignIn';

import './App.css';

export const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/main' element={<Main />} />
      </Routes>
    </div>
  );
};
