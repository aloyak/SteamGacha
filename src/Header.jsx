const pages = [
  { id: 'packs', label: 'Packs' },
  { id: 'collection', label: 'Collection' },
  { id: 'lab', label: 'Lab' },
  { id: 'market', label: 'Market' }
];

export default function Header({ page, onPageChange }) {
  return (
    <header className="border-b border-white/10 bg-[#050814] p-4">
      <nav className="flex justify-center gap-4">
        {pages.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              page === item.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}