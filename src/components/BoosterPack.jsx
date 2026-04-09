import { useState, useRef } from 'react';

export default function BoosterPack({ onClick, title = "STEAM", series = "SERIES 2026" }) {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - (rect.height / 2)) / (rect.height / 2)) * -12;
    const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  return (
    <div 
      className="relative group cursor-pointer"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={onClick}
    >
      <div className="absolute -inset-10 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
      
      <div 
        ref={containerRef}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 ? 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
        }}
        className="relative w-80 aspect-[2/3.2] transform-gpu overflow-hidden rounded-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-950" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

        <div className="absolute top-0 w-full h-6 bg-blue-950/80 flex justify-between px-0.5 z-10">
          {[...Array(16)].map((_, i) => <div key={i} className="w-4 h-4 bg-slate-950 rotate-45 -translate-y-2.5" />)}
        </div>
        <div className="absolute bottom-0 w-full h-6 bg-blue-950/80 flex justify-between px-0.5 z-10">
          {[...Array(16)].map((_, i) => <div key={i} className="w-4 h-4 bg-slate-950 rotate-45 translate-y-2.5" />)}
        </div>

        <div className="h-full flex flex-col items-center justify-center p-8 relative z-0">
           <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-2xl">🎮</div>
           <h2 className="text-white font-black text-4xl tracking-tighter italic leading-none text-center">
             {title}<br/><span className="text-blue-400">BOOSTER</span>
           </h2>
           <p className="mt-8 text-white/40 text-[9px] font-black tracking-[0.4em] uppercase">{series}</p>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
        </div>
      </div>
    </div>
  );
}