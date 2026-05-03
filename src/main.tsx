import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use a persistent handle on the DOM element to prevent "multiple roots" errors
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

// Check if a root already exists for this element
let root = (rootElement as any)._reactRoot;

if (!root) {
  root = createRoot(rootElement);
  (rootElement as any)._reactRoot = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
