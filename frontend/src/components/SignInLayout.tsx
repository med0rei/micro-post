import React from 'react';

export const SignInLayout = ({ children }) => {
  return (
    <div
      className='layout'
      style={{
        marginTop: '40px',
      }}
    >
      {children}
    </div>
  );
};
