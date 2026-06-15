import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="St. Xavier's Sr. Sec. School, Jaipur - A premier Jesuit institution dedicated to excellence in education since 1941. Rooted in tradition, focused on the future." />
        <meta name="keywords" content="St. Xavier's School Jaipur, Xaviers Jaipur, Best School in Jaipur, Jesuit School Jaipur, St. Xavier's Senior Secondary School, Education in Jaipur, School Admissions Jaipur" />
        <meta name="author" content="St. Xavier's Sr. Sec. School, Jaipur" />
        <meta property="og:title" content="St. Xavier's Sr. Sec. School, Jaipur" />
        <meta property="og:description" content="A Legacy of Excellence in Education Since 1941." />
        <meta property="og:image" content="/api/img?url=https%3A%2F%2Fbfqyrnvyhivflapjwllk.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fuploads%2FGlobal_Settings%2Fcropped-Favicon-300x300.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/png" href="/api/img?url=https%3A%2F%2Fbfqyrnvyhivflapjwllk.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fuploads%2FGlobal_Settings%2Fcropped-Favicon-300x300.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Early suppression of MetaMask and Web3 related errors that might be injected by browser extensions
              (function() {
                var silence = function(e) {
                  var msg = (e.message || (e.reason && e.reason.message) || "").toLowerCase();
                  if (msg.indexOf('metamask') !== -1 || msg.indexOf('ethereum') !== -1 || msg.indexOf('web3') !== -1) {
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    if (e.preventDefault) e.preventDefault();
                    return true;
                  }
                };
                window.addEventListener('error', silence, true);
                window.addEventListener('unhandledrejection', silence, true);
              })();
            `,
          }}
        />
      </Head>
      <body className="antialiased text-gray-950 bg-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
