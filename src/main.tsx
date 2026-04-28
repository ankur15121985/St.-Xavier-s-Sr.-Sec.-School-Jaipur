import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

/**
 * Robust React 18/19 Root Management
 * 
 * In development environments (like AI Studio or during HMR), this script may re-run.
 * We store the 'root' object in multiple locations to ensure we only ever call 
 * createRoot(container) exactly once for the lifetime of the DOM node.
 */
function getExistingRoot(): Root | undefined {
  return (container as any)._reactRoot || (window as any)._reactRoot || ((import.meta as any).hot?.data?.root);
}

let root = getExistingRoot();

if (!root) {
  try {
    root = createRoot(container);
    
    // Persist the root reference across module re-executions
    (container as any)._reactRoot = root;
    (window as any)._reactRoot = root;
    if ((import.meta as any).hot) {
      (import.meta as any).hot.data.root = root;
    }
  } catch (err) {
    console.warn('[React] createRoot warning/error caught:', err);
    // In rare cases where getting the root fails but React knows it's there
  }
}

if (root) {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
