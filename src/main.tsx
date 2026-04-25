import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// Use a property on the container to persist the root between hot reloads
const ROOT_KEY = '__react_root__';
let root = (container as any)[ROOT_KEY];

if (!root) {
  root = createRoot(container);
  (container as any)[ROOT_KEY] = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
