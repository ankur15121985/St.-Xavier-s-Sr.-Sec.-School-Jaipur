import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use a persistent global handle to prevent "multiple roots" errors
const ROOT_ID = 'root';
const ROOT_KEY = Symbol.for('__react_root_handle__');
const g = window as any;

let container = document.getElementById(ROOT_ID);
if (!container) throw new Error('Failed to find root element');

// Helper to check if a node is already managed by React
const isManaged = (node: HTMLElement) => {
  return Object.keys(node).some(key => key.startsWith('__reactContainer'));
};

let root = (container as any)[ROOT_KEY] || g.__REACT_ROOT__;

if (!root) {
  if (isManaged(container)) {
    // If React already manages this node but we lost the handle, we must reset the container
    const newContainer = container.cloneNode(false) as HTMLElement;
    container.parentNode?.replaceChild(newContainer, container);
    container = newContainer;
  }
  
  root = createRoot(container);
  (container as any)[ROOT_KEY] = root;
  g.__REACT_ROOT__ = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
