import { useState, useEffect } from 'react';
import BoosterPack from './components/BoosterPack';
import GameCard from './components/GameCard';

export default function PacksPage() {
  const [pool, setPool] = useState([]);
  const [pack, setPack] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(-1);

  useEffect(() => {
    fetch('/games.json').then(res => res.json()).then(setPool);
  }, []);

  const generatePack = () => {
    const newPack = [];
    for (let i = 0; i < 5; i++) {
      let target = i === 4 ? (Math.random() > 0.8 ? "LEGENDARY" : "EPIC") : (Math.random() * 100 < 70 ? "COMMON" : "RARE");
      const options = pool.filter(g => g.rarity === target);
      newPack.push(options[Math.floor(Math.random() * options.length)] || pool[0]);
    }
    setPack(newPack);
    setCurrentIdx(0);
    
    // Save to collection
    const saved = JSON.parse(localStorage.getItem('steam_collection') || '[]');
    const filtered = newPack.filter(p => !saved.some(s => s.id === p.id));
    localStorage.setItem('steam_collection', JSON.stringify([...saved, ...filtered]));
  };

  if (currentIdx === -1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <BoosterPack onClick={generatePack} />
        <p className="mt-12 text-blue-400/60 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Rip to Reveal</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <div className="flex gap-4">
        {pack.map((_, i) => (
          <div key={i} onClick={() => setCurrentIdx(i)} className={`h-2 w-16 rounded-full cursor-pointer transition-all ${i === currentIdx ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/10'}`} />
        ))}
      </div>

      <GameCard game={pack[currentIdx]} />

      <div className="flex items-center gap-6">
        <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)} className="p-4 rounded-full bg-white/5 text-slate-400 hover:text-white disabled:opacity-20 transition-all">←</button>
        <div className="text-white font-black text-lg">{currentIdx + 1} / 5</div>
        {currentIdx < 4 ? (
          <button onClick={() => setCurrentIdx(prev => prev + 1)} className="p-4 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">→</button>
        ) : (
          <button onClick={() => { setPack([]); setCurrentIdx(-1); }} className="px-10 py-3 rounded-2xl bg-white text-black font-black text-sm">FINISH</button>
        )}
      </div>
    </div>
  );
}