import dynamic from 'next/dynamic';

const ReactAppLoader = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen w-full flex items-center justify-center bg-white text-gray-800">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium animate-pulse">Initializing school portal...</p>
      </div>
    </div>
  ),
});

export default function CatchAllPage() {
  return <ReactAppLoader />;
}
