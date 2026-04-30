import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

// Use a global variable to persist the root between module reloads during development
const globalRootKey = '__SCHOOL_APP_ROOT__';
if (!(window as any)[globalRootKey]) {
  (window as any)[globalRootKey] = createRoot(rootElement);
}

const root = (window as any)[globalRootKey];
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
