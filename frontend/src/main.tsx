import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FluentProvider>
  </React.StrictMode>,
);
