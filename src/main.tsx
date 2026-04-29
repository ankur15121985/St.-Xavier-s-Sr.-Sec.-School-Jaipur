import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// Enhanced React Root Management for high-frequency re-renders
const globalRootKey = '__SCHOOL_APP_ROOT__';
let root = (window as any)[globalRootKey];

if (!root) {
  root = createRoot(container);
  (window as any)[globalRootKey] = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
