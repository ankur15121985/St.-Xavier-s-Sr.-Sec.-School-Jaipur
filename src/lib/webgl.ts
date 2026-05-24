import { useState, useEffect } from 'react';

export function useWebGLAvailable(): boolean {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        typeof window !== 'undefined' &&
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setIsAvailable(supported);
    } catch (e) {
      setIsAvailable(false);
    }
  }, []);

  return isAvailable;
}
