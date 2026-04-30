import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enhanced React Root Management to prevent dual-initialization warnings
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

// Use a truly global key to prevent re-creation during module reloads
const ROOT_SYMBOL = Symbol.for('app.root');
let root = (window as any)[ROOT_SYMBOL];

if (!root) {
  root = createRoot(rootElement);
  (window as any)[ROOT_SYMBOL] = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
