import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// @ts-ignore
if (!window.__XAVIERS_ROOT__) {
  // @ts-ignore
  window.__XAVIERS_ROOT__ = createRoot(container);
}

// @ts-ignore
const root = window.__XAVIERS_ROOT__;
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
