import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// Robust React 18/19 Root Management
// We store the root on the window to ensure we only call createRoot once,
// which prevents the "calling createRoot on a container that has already 
// been passed to createRoot before" warning.
if (!(window as any)._reactRoot) {
  (window as any)._reactRoot = createRoot(container);
}

const root = (window as any)._reactRoot;

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
