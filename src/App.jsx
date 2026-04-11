import { useState } from 'react';
import Header from './Header.jsx';
import PacksPage from './Packs.jsx';
import CollectionPage from './Collection.jsx';
import Lab from './Lab.jsx';
import Market from './Market.jsx';

export default function App() {
  const [page, setPage] = useState('packs');

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <Header page={page} onPageChange={setPage} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {page === 'packs' && <PacksPage />}
        {page === 'collection' && <CollectionPage />}
        {page === 'lab' && <Lab />}
        {page === 'market' && <Market />}
      </main>
    </div>
  );
}