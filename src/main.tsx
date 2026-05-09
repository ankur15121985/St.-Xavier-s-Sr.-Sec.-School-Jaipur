import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error suppression for MetaMask/Web3 injected errors
const silencer = (e: any) => {
  const msg = (e.message || (e.reason && e.reason.message) || "").toLowerCase();
  if (msg.includes('metamask') || msg.includes('ethereum') || msg.includes('web3')) {
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (e.preventDefault) e.preventDefault();
    return true;
  }
};
window.addEventListener('error', silencer, true);
window.addEventListener('unhandledrejection', silencer, true);

// Use a persistent handle on the window or DOM element to prevent "multiple roots" errors
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

// React 18/19 stores internal state on the container.
// We use a global variable on window to keep the root reference across module re-executions.
// We also check the root element itself for internal properties.
const _rootElement = rootElement as any;
let root = (window as any)._reactRoot || _rootElement._reactRoot;

if (!root) {
  root = createRoot(rootElement);
  (window as any)._reactRoot = root;
  _rootElement._reactRoot = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
