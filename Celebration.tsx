import React, { useState, useEffect } from 'react';
import { RefreshCcw, Gift, Heart } from 'lucide-react';
import FireworksCanvas from './FireworksCanvas';

interface CelebrationProps {
  onRestart: () => void;
}

const WISHES = [
  "Semoga tahun ini penuh kebahagiaan & rezeki melimpah!",
  "Tahun baru, semangat baru, harapan baru!",
  "Sehat selalu, sukses terus, dan bahagia selamanya!",
  "2026: Waktunya wujudkan semua mimpimu!"
];

const Celebration: React.FC<CelebrationProps> = ({ onRestart }) => {
  const [text, setText] = useState("");
  const [showSurprise, setShowSurprise] = useState(false);
  const fullText = WISHES[0]; 

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="relative w-full min-h-screen bg-slate-900 text-white overflow-hidden flex flex-col items-center justify-center font-sans">
      <FireworksCanvas />
      
      {/* Main Content Card */}
      <div className="z-10 w-full max-w-3xl px-6 text-center">
        
        {/* Animated Year */}
        <div className="relative mb-8 group select-none">
          <h1 className="text-[6rem] md:text-[10rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 animate-float drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
            2026
          </h1>
          <div className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 text-2xl md:text-4xl font-handwriting text-yellow-300 rotate-[-10deg] animate-pulse whitespace-nowrap drop-shadow-md">
            Selamat Tahun Baru
          </div>
        </div>

        {/* Typing Wish */}
        <div className="min-h-[5rem] mb-12 flex items-center justify-center">
          <p className="text-xl md:text-2xl text-cyan-200 font-light tracking-wide bg-black/40 backdrop-blur-sm px-6 py-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] leading-relaxed">
            {text}<span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Interactive Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            
            {/* Surprise Button */}
            <button 
                onClick={() => setShowSurprise(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-bold shadow-lg transform transition hover:scale-105 hover:rotate-1 active:scale-95 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="flex items-center gap-2">
                    <Gift className="w-6 h-6 animate-bounce" /> Klik untuk Kejutan
                </span>
            </button>

            {/* Restart Button */}
            <button 
                onClick={onRestart}
                className="px-8 py-4 bg-slate-800/80 border border-slate-600 hover:bg-slate-700 rounded-full text-lg font-semibold text-slate-300 transition flex items-center gap-2 hover:text-white"
            >
                <RefreshCcw className="w-5 h-5" /> Main Lagi
            </button>
        </div>
      </div>

      {/* Surprise Modal Overlay */}
      {showSurprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-pop-in">
           <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl border-4 border-yellow-400">
              <button 
                onClick={() => setShowSurprise(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-xl"
              >
                ✕
              </button>
              
              <div className="mb-6 flex justify-center">
                 <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-6xl animate-bounce">
                    🎁
                 </div>
              </div>
              
              <h2 className="text-3xl font-bold text-purple-600 mb-4 font-handwriting">
                Kamu Luar Biasa!
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                 Terima kasih sudah bertahan sejauh ini. Semoga di tahun 2026, semua bug di hidupmu ter-fix, dompetmu overflow, dan bahagiamu infinite loop! 🚀
              </p>
              
              <div className="flex justify-center gap-4 text-3xl">
                 <span className="animate-pulse delay-75">💖</span>
                 <span className="animate-pulse delay-150">🌟</span>
                 <span className="animate-pulse delay-300">🎉</span>
              </div>
              
              <button 
                 onClick={() => setShowSurprise(false)}
                 className="mt-8 w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200"
              >
                 Siap, Gasken!
              </button>
           </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-slate-500 text-sm flex items-center gap-1">
        Dibuat dengan <Heart className="w-3 h-3 text-red-500 fill-red-500" /> untuk menyambut 2026
      </div>
    </div>
  );
};

export default Celebration;