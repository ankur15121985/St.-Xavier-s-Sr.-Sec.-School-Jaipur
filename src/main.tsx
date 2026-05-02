import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Robust React Root Management to handle script re-evaluations and HMR-like environments
const getRoot = () => {
  const ROOT_STORE_KEY = '__APP_REACT_ROOT__';
  const _window = window as any;
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('[Root] Target container #root not found');
    throw new Error('Failed to find root element');
  }

  // 1. If we already have a root stored globally, use it. This is exactly what React 18 recommends
  // to avoid the "already been passed to createRoot" warning.
  if (_window[ROOT_STORE_KEY]) {
    console.info('[Root] Using existing React root from global store.');
    return _window[ROOT_STORE_KEY];
  }

  // 2. Check if this specific element has already been used by React by inspecting its properties
  // React attaches a property starting with __reactContainer to the DOM node
  const container = rootElement as any;
  const isInitialized = Object.getOwnPropertyNames(container).some(key => key.startsWith('__reactContainer$')) ||
                        Object.keys(container).some(key => key.startsWith('__reactContainer$'));

  if (isInitialized) {
    console.warn('[Root] Element #root was already initialized by another React instance but no global reference was found. Replacing element to safely reset.');
    const newRootElement = document.createElement('div');
    newRootElement.id = 'root';
    if (rootElement.parentNode) {
      rootElement.parentNode.replaceChild(newRootElement, rootElement);
    }
    
    try {
      const root = createRoot(newRootElement);
      _window[ROOT_STORE_KEY] = root;
      return root;
    } catch (err) {
      console.error('[Root] Emergency recovery failure:', err);
      throw err;
    }
  }

  // 3. Normal path: First time initialization
  console.info('[Root] Initializing fresh React root.');
  const root = createRoot(rootElement);
  _window[ROOT_STORE_KEY] = root;
  return root;
};

const root = getRoot();

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
