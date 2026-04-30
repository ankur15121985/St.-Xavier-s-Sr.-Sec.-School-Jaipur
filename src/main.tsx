import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Robust React Root Management to prevent dual-initialization warnings
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

// Use a global to persist the root between reloads (e.g. during dev HMR or refresh)
const win = window as any;
if (!win.__REACT_ROOT__) {
  win.__REACT_ROOT__ = createRoot(rootElement);
}

win.__REACT_ROOT__.render(
  <StrictMode>
    <App />
  </StrictMode>
);
