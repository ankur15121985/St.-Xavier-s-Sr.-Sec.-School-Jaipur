import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export const Link = React.forwardRef<HTMLAnchorElement, any>(({ to, href, ...props }, ref) => {
  const target = to || href || '#';
  return <NextLink href={target} ref={ref} {...props} />;
});

Link.displayName = 'Link';

export const useNavigate = () => {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (typeof window !== 'undefined') {
        window.history.go(to);
      }
    } else {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  };
};

export const useLocation = () => {
  const router = useRouter();
  const [hash, setHash] = React.useState('');

  React.useEffect(() => {
    setHash(window.location.hash);
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const cleanPathname = React.useMemo(() => {
    if (!router.asPath) return '/';
    return router.asPath.split('?')[0].split('#')[0] || '/';
  }, [router.asPath]);

  return {
    pathname: cleanPathname,
    asPath: router.asPath,
    hash: hash,
    search: typeof window !== 'undefined' ? window.location.search : '',
  };
};

export const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
};
