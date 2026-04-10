import { useState, useEffect, useRef } from 'react';
import BoosterPack from './components/BoosterPack';
import GameCard from './components/GameCard';

export default function PacksPage() {
  const [pool, setPool] = useState([]);
  const [pack, setPack] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [isOpening, setIsOpening] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const openingTimersRef = useRef([]);

  const rarityOrder = {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4,
    MYTHIC: 5
  };

  const rarityOdds = [
    { rarity: 'COMMON', weight: 1 / 1.2 },
    { rarity: 'UNCOMMON', weight: 1 / 3 },
    { rarity: 'RARE', weight: 1 / 7 },
    { rarity: 'EPIC', weight: 1 / 22 },
    { rarity: 'LEGENDARY', weight: 1 / 55 },
    { rarity: 'MYTHIC', weight: 1 / 130 }
  ];

  const rollRarity = (weights) => {
    const totalWeight = weights.reduce((sum, entry) => sum + entry.weight, 0);
    const roll = Math.random() * totalWeight;
    let total = 0;

    for (const { rarity, weight } of weights) {
      total += weight;
      if (roll < total) {
        return rarity;
      }
    }

    return weights[weights.length - 1].rarity;
  };

  useEffect(() => {
    fetch('/games.json').then(res => res.json()).then(setPool);
  }, []);

  useEffect(() => {
    return () => {
      for (const timer of openingTimersRef.current) {
        clearTimeout(timer);
      }
    };
  }, []);

  const buildPack = () => {
    const newPack = [];

    for (let i = 0; i < 5; i++) {
      const target = rollRarity(rarityOdds);
      const options = pool.filter(g => g.rarity === target);

      if (options.length > 0) {
        newPack.push(options[Math.floor(Math.random() * options.length)]);
        continue;
      }

      const fallbackPool = pool.filter(g => rarityOdds.some(({ rarity }) => rarity === g.rarity));
      const randomFallbackPool = fallbackPool.length > 0 ? fallbackPool : pool;
      newPack.push(randomFallbackPool[Math.floor(Math.random() * randomFallbackPool.length)]);
    }

    return newPack.sort((left, right) => {
      return (rarityOrder[left.rarity] ?? 0) - (rarityOrder[right.rarity] ?? 0);
    });
  };

  const generatePack = () => {
    if (isOpening || pool.length === 0) {
      return;
    }

    setIsOpening(true);

    const revealTimer = setTimeout(() => {
      const newPack = buildPack();

      setPack(newPack);
      setCurrentIdx(0);
      setIsOpening(false);

      const saved = JSON.parse(localStorage.getItem('steam_collection') || '[]');
      const filtered = newPack.filter(p => !saved.some(s => s.id === p.id));
      localStorage.setItem('steam_collection', JSON.stringify([...saved, ...filtered]));
    }, 2000);

    openingTimersRef.current.push(revealTimer);
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      setPack([]);
      setCurrentIdx(-1);
      setIsFinishing(false);
    }, 1000);
  };

  if (currentIdx === -1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] relative">
        {isOpening && <div className="screen-flash-overlay" />}

        <BoosterPack
          onClick={generatePack}
          disabled={isOpening}
          packClassName={isOpening ? 'pack-animating' : ''}
        />

        <p className={`mt-12 font-black tracking-[0.5em] text-[10px] uppercase transition-opacity duration-300 ${isOpening ? 'opacity-0' : 'text-blue-400/60 animate-pulse'}`}>
          Rip to Reveal
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 py-6 overflow-hidden min-h-[85vh]">
      <div className="relative w-80 aspect-[2/3.1] my-4" style={{ perspective: '1200px' }}>
        {pack.map((game, i) => {
          const isActive = i === currentIdx;
          const isPrev = i < currentIdx;
          const isNext = i > currentIdx;

          let transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
          let zIndex = 10;
          let opacity = 1;
          let pointerEvents = 'auto';

          if (isFinishing) {
            transform = `translate3d(0, 150vh, 0) rotate(${(i - 2) * 25}deg)`;
            opacity = 0;
            pointerEvents = 'none';
          } else if (isPrev) {
            const offset = currentIdx - i;
            transform = `translate3d(-${45 + offset * 15}%, 0, -${350 * offset}px) scale(${1 - offset * 0.1}) rotate(-${8 + offset}deg)`;
            zIndex = 10 - offset;
            opacity = offset === 1 ? 0.6 : 0; 
            pointerEvents = 'none';
          } else if (isNext) {
            const offset = i - currentIdx;
            transform = `translate3d(${45 + offset * 15}%, 0, -${350 * offset}px) scale(${1 - offset * 0.1}) rotate(${8 + offset}deg)`;
            zIndex = 10 - offset;
            opacity = offset === 1 ? 0.6 : 0;
            pointerEvents = 'none';
          }

          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                transform,
                zIndex,
                opacity,
                pointerEvents,
                transition: isFinishing 
                  ? `all 0.6s cubic-bezier(0.5, -0.5, 0.5, 1.5) ${i * 100}ms`
                  : 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                transformStyle: 'preserve-3d'
              }}
            >
              <GameCard game={game} />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-8 z-20 transition-opacity duration-300" style={{ opacity: isFinishing ? 0 : 1 }}>
        <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)} className="p-4 rounded-full bg-white/5 text-slate-400 hover:text-white disabled:opacity-20 transition-all">←</button>
        <div className="text-white font-black text-lg">{currentIdx + 1} / 5</div>
        {currentIdx < 4 ? (
          <button onClick={() => setCurrentIdx(prev => prev + 1)} className="cursor-pointer p-4 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">→</button>
        ) : (
          <button onClick={handleFinish} className="cursor-pointer px-10 py-3 rounded-2xl bg-white text-black font-black text-sm hover:scale-105 transition-transform">FINISH</button>
        )}
      </div>
    </div>
  );
}