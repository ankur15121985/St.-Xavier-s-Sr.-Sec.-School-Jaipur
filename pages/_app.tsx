import type { AppProps } from 'next/app';
import '../src/index.css';
import { SupabaseProvider } from '../src/components/SupabaseProvider';
import { AppDataProvider } from '../src/context/AppDataContext';
import { HelmetProvider } from 'react-helmet-async';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <AppDataProvider>
        <HelmetProvider>
          <Component {...pageProps} />
        </HelmetProvider>
      </AppDataProvider>
    </SupabaseProvider>
  );
}

