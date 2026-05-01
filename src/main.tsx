import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Robust React Root Management to prevent dual-initialization warnings
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

const win = window as any;
if (!win.__REACT_ROOT__) {
  win.__REACT_ROOT__ = createRoot(rootElement);
} else if (import.meta.env.DEV) {
    // In dev mode, we might want to ensure we're using the latest render logic if needed, 
    // but the warning specifically triggers on createRoot calls.
}

const root = win.__REACT_ROOT__;

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
