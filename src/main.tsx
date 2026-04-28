import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// Standard pattern to handle multiple entries/renders during dev
let root: Root;
if ((container as any)._root) {
  root = (container as any)._root;
} else {
  root = createRoot(container);
  (container as any)._root = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
