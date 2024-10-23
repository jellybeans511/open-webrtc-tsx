import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18では'react-dom/client'を使う
import './index.css';
import App from './App';

// createRootを使用してルート要素にマウント
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
