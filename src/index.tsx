import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './routes';
import reportWebVitals from './reportWebVitals';
import { SWRConfig } from 'swr';
import { TRPCReactProvider } from './trpc/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <SWRConfig value={{ shouldRetryOnError: false, revalidateOnFocus: false }}>
    <TRPCReactProvider>
      <App />
    </TRPCReactProvider>
  </SWRConfig>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
