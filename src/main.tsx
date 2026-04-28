import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// Access the root via the container itself to ensure it's unique to this DOM node
let root = (container as any)._reactRoot;
if (!root) {
  root = createRoot(container);
  (container as any)._reactRoot = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
