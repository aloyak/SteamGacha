import { FaGithub } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import CursorPopup from './components/Popup';

const pages = [
  { id: 'packs', label: 'Packs' },
  { id: 'collection', label: 'Collection' },
  { id: 'lab', label: 'Lab' },
  { id: 'market', label: 'Market' }
];

export default function Header({ page, onPageChange }) {
  const [collection, setCollection] = useState([]);
  const [arcanaHover, setArcanaHover] = useState({ open: false, x: 0, y: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('steam_collection') || '[]');
    setCollection(saved);
  }, []);

  const hasArcanaPage = false;
  const canAccessArcana = useMemo(() => {
    const hasEnoughCards = new Set(collection.map((card) => card.id)).size >= 150;
    const hasMythicCard = collection.some((card) => card.rarity === 'MYTHIC');
    return hasEnoughCards && hasMythicCard;
  }, [collection]);

  const showArcanaPopup = !hasArcanaPage || !canAccessArcana;

  return (
    <header className="border-b border-white/10 bg-[#050814] px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="w-28 text-xs font-medium text-slate-500">
          By <a href="https://aloyak.dev" className="text-blue-400 hover:text-blue-300">4loyak!</a>
        </div>
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex justify-center gap-4">
          {pages.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition ${
                page === item.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div
            className="relative"
            onMouseEnter={(event) => setArcanaHover({ open: showArcanaPopup, x: event.clientX, y: event.clientY })}
            onMouseMove={(event) => setArcanaHover((prev) => ({ ...prev, x: event.clientX, y: event.clientY }))}
            onMouseLeave={() => setArcanaHover({ open: false, x: 0, y: 0 })}
          >
            <button
              onClick={() => onPageChange('arcana')}
              disabled={!hasArcanaPage || !canAccessArcana}
              className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition ${
                !hasArcanaPage || !canAccessArcana
                  ? 'cursor-not-allowed opacity-40 text-slate-500'
                  : page === 'arcana'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white'
              }`}
            >
              Arcana
            </button>

            <CursorPopup open={arcanaHover.open} x={arcanaHover.x} y={arcanaHover.y}>
              <div className="max-w-[180px]">
                <p className="font-semibold text-white">Coming soon</p>
                <p className="mt-1 text-[11px] leading-snug text-slate-300">
                  You need at least 150 unique cards and 1 Mythic card to access Arcana!
                </p>
              </div>
            </CursorPopup>
          </div>
        </nav>

        <a
          href="https://github.com/aloyak/steamgacha"
          aria-label="GitHub"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          title="GitHub"
        >
          <FaGithub className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}