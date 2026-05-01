import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Robust React Root Management
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

// Use a global variable to store the React root to prevent multiple initializations
const _window = window as any;
const ROOT_STORE_KEY = '__APP_REACT_ROOT__';

let root = _window[ROOT_STORE_KEY];

if (!root) {
  // Check if the element has already been used as a container to avoid the warning
  // In some dev environments, the container might still have React's internal properties
  // even if the script is re-running.
  const container = rootElement as any;
  const isInitialized = Object.keys(container).some(key => key.startsWith('__reactContainer$'));
  
  if (isInitialized) {
    // If it's already initialized but we lost our root reference, 
    // we can't easily recover it. Clearing the element's internal state
    // is tricky, but we'll try to find the fiber root if possible or just
    // Proceed with a fresh one after clearing innerHTML.
    // However, the best way is to not re-create it if we can avoid it.
    console.warn('[Root] Container already initialized. Attempting recovery.');
    rootElement.innerHTML = '';
  }
  
  try {
    root = createRoot(rootElement);
    _window[ROOT_STORE_KEY] = root;
  } catch (err) {
    console.error('[Root] Failed to create React root:', err);
    // Fallback: if createRoot fails, try to just use what's there or refresh
    throw err;
  }
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
