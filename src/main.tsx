import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Robust React Root Management to prevent dual-initialization warnings
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

const win = window as any;
// Global key to persist the React root across script re-evaluations
const GLOBAL_ROOT_KEY = '__XAVIERS_JAIPUR_ROOT_SINGLETON__';

let root = win[GLOBAL_ROOT_KEY];

if (!root) {
  // If we don't have a saved root, but the container was already used by React,
  // we try to clean up or just ignore the warning if it's unavoidable.
  // However, we'll try to find any existing root property to reuse it or clear it.
  for (const key in container) {
    if (key.startsWith('__reactContainer$')) {
      // If we find this, React has already initialized this container.
      // We can't easily retrieve the 'root' object from it, so we'll 
      // just try to clear the container to avoid the warning on a fresh createRoot.
      container.innerHTML = '';
      break;
    }
  }
  
  root = createRoot(container);
  win[GLOBAL_ROOT_KEY] = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
