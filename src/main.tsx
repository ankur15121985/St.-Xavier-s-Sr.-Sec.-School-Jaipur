import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use a persistent handle on the DOM element to prevent "multiple roots" errors
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

// In some environments, scripts might re-run. 
// We use a global key on the window object to store the root and check it.
let root = (window as any)._reactRoot;

if (!root) {
  root = createRoot(rootElement);
  (window as any)._reactRoot = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
