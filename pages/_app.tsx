import type { AppProps } from 'next/app';
import '../src/index.css';
import { SupabaseProvider } from '../src/components/SupabaseProvider';
import { AppDataProvider } from '../src/context/AppDataContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <AppDataProvider initialData={pageProps.initialData}>
        <HelmetProvider>
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          </Helmet>
          <Component {...pageProps} />
        </HelmetProvider>
      </AppDataProvider>
    </SupabaseProvider>
  );
}

