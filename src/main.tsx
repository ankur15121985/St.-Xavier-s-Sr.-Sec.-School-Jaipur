import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// Fix for "You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before"
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
