import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// Robust React 18+ Root Management
// We store the 'root' object on the container and window to ensure we only call createRoot once.
const ROOT_KEY = '__REACT_ROOT__';
let root: Root;

const existingRoot = (window as any)[ROOT_KEY] || (container as any)[ROOT_KEY];

if (existingRoot && typeof existingRoot.render === 'function') {
  root = existingRoot;
} else {
  root = createRoot(container);
  (window as any)[ROOT_KEY] = root;
  (container as any)[ROOT_KEY] = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
