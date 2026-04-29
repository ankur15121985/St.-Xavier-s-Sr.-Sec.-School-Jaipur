import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

// Robust React 18/19 Root Management
if (!(container as any)._reactRoot) {
  (container as any)._reactRoot = createRoot(container);
}
const root = (container as any)._reactRoot;

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
