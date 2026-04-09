import { useState, useRef } from 'react';

export default function GameCard({ game }) {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const rarityStyles = {
    COMMON: 'border-white/10 text-slate-400',
    RARE: 'border-blue-500/50 text-blue-400',
    EPIC: 'border-purple-500/50 text-purple-400',
    LEGENDARY: 'border-amber-400 shadow-amber-500/20 text-amber-400'
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - (rect.height / 2)) / (rect.height / 2)) * -10;
    const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  return (
    <div style={{ perspective: '1200px' }}>
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 ? 'transform 0.5s ease' : 'none'
        }}
        className={`w-96 aspect-[2/3] rounded-[2.5rem] border-2 relative shadow-2xl overflow-hidden flex flex-col transform-gpu bg-slate-900 ${rarityStyles[game.rarity] || rarityStyles.COMMON}`}
      >
        <img src={game.image} className="h-1/2 w-full object-cover pointer-events-none" alt={game.name} />
        <div className="p-8 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-black pointer-events-none">
          <div>
            <span className={`text-xs font-black tracking-[0.3em] uppercase ${rarityStyles[game.rarity]?.split(' ')[1]}`}>
              {game.rarity}
            </span>
            <h3 className="text-3xl font-bold text-white leading-tight mb-2 italic">{game.name}</h3>
          </div>
          <div className="flex justify-between items-end border-t border-white/5 pt-6">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black">Rating</p>
              <p className="font-mono text-cyan-400 text-xl font-bold">{game.score}%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-black">Reviews</p>
              <p className="font-mono text-slate-300 text-xl font-bold">
                {game.reviews >= 1000 ? (game.reviews / 1000).toFixed(1) + 'k' : game.reviews}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}