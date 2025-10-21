import type { ReactNode } from 'react';

export const SignInLayout = ({ children }: { children: ReactNode }) => {
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
