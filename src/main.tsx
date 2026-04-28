import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

const GLOBAL_ROOT_ID = '_reactRoot_v1';

// Aggressive root retrieval
let root = (container as any)[GLOBAL_ROOT_ID] || (window as any)[GLOBAL_ROOT_ID];

if (!root) {
  console.log('[Main] Creating new React root');
  try {
    root = createRoot(container);
    (container as any)[GLOBAL_ROOT_ID] = root;
    (window as any)[GLOBAL_ROOT_ID] = root;
  } catch (err) {
    console.error('[Main] Failed to create root:', err);
  }
} else {
  console.log('[Main] Using existing React root');
}

if (root && typeof root.render === 'function') {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error('[Main] Root object is invalid or render function missing', root);
}
