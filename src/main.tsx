import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use a persistent global handle to prevent "multiple roots" errors
const g = window as any;
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

// Ensure createRoot is only called once
if (!g._reactRoot) {
  try {
    g._reactRoot = createRoot(rootElement);
  } catch (e) {
    console.warn('React root already exists on container, attempting to recover...');
  }
}

if (g._reactRoot) {
  g._reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
