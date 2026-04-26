import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

const ROOT_KEY = '_reactRoot';
let root = (window as any)[ROOT_KEY];

if (!root) {
  root = createRoot(container);
  (window as any)[ROOT_KEY] = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
