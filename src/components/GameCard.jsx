import { useState, useRef } from 'react';

export default function GameCard({ game }) {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const rarityStyles = {
    COMMON: 'border-white/10 text-slate-400',
    UNCOMMON: 'border-blue-500/50 text-blue-400',
    RARE: 'border-emerald-500/50 text-emerald-400',
    EPIC: 'border-purple-500/50 text-purple-400',
    LEGENDARY: 'border-amber-400 shadow-amber-500/20 text-amber-400',
    MYTHIC: 'border-red-500/60 shadow-red-500/20 text-red-400'
  };

  const rarityTextStyles = {
    COMMON: 'text-slate-400',
    UNCOMMON: 'text-blue-400',
    RARE: 'text-emerald-400',
    EPIC: 'text-purple-400',
    LEGENDARY: 'text-amber-400',
    MYTHIC: 'text-red-400'
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - (rect.height / 2)) / (rect.height / 2)) * -10;
    const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const formattedPrice = typeof game.price === 'number'
    ? (game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`)
    : (game.isFree ? 'Free' : 'N/A');

  const developer = game.developer || 'Unknown';

  return (
    <a href={`https://store.steampowered.com/app/${game.id}`} target="_blank" rel="noopener noreferrer" style={{ perspective: '1200px', display: 'block' }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 ? 'transform 0.5s ease' : 'none'
        }}
        className={`w-80 aspect-[2/3.1] rounded-xl border-2 relative shadow-2xl overflow-hidden flex flex-col transform-gpu bg-slate-900 cursor-pointer ${rarityStyles[game.rarity] || rarityStyles.COMMON}`}
      >
        <div className="px-4 py-3 flex items-center gap-2 border-b border-white/5 bg-white/5">
          <span className={`text-[10px] ${rarityTextStyles[game.rarity] || rarityTextStyles.COMMON}`}>◈</span>
          <span className={`text-xs font-black tracking-[0.2em] uppercase ${rarityTextStyles[game.rarity] || rarityTextStyles.COMMON}`}>
            {game.rarity}
          </span>
        </div>

        <div className="p-3">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 shadow-inner bg-black">
            <img 
              src={game.image} 
              className="w-full h-full object-cover pointer-events-none" 
              alt={game.name} 
            />
          </div>
        </div>

        <div className="px-5 pb-6 flex-1 flex flex-col justify-between pointer-events-none">
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white leading-tight mb-4 italic">{game.name}</h3>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">{developer}</p>
          </div>
          
          <div className="flex justify-between items-end border-t border-white/5 pt-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black">Rating</p>
              <p className="font-mono text-cyan-400 text-lg font-bold">{game.score}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase font-black">Price</p>
              <p className="font-mono text-slate-200 text-lg font-bold">{formattedPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-black">Reviews</p>
              <p className="font-mono text-slate-300 text-lg font-bold">
                {game.reviews >= 1000 ? (game.reviews / 1000).toFixed(1) + 'k' : game.reviews}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}