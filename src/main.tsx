import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use a persistent handle on the window or DOM element to prevent "multiple roots" errors
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

// React 18/19 stores internal state on the container.
// We use a global variable on window to keep the root reference across module re-executions.
// We also check the root element itself for internal properties.
const _rootElement = rootElement as any;
let root = (window as any)._reactRoot || _rootElement._reactRoot;

if (!root) {
  root = createRoot(rootElement);
  (window as any)._reactRoot = root;
  _rootElement._reactRoot = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
