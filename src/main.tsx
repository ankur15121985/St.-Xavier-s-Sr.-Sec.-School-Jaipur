import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Robust React Root Management to prevent dual-initialization warnings
const win = window as any;
let root = win.__REACT_ROOT__;

if (!root) {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Failed to find root element');
  root = createRoot(rootElement);
  win.__REACT_ROOT__ = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
