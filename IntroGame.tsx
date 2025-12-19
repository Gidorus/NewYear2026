import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface IntroGameProps {
  onComplete: () => void;
}

const GRAVITY = 0.6;
const JUMP_STRENGTH = -8;
const OBSTACLE_SPEED = 3.5;
const OBSTACLE_WIDTH = 60;
const GAP_SIZE = 200;
const BIRD_SIZE = 40;
const WIN_SCORE = 5;

interface Obstacle {
  x: number;
  topHeight: number;
  passed: boolean;
}

const IntroGame: React.FC<IntroGameProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER' | 'WON'>('START');
  const [birdY, setBirdY] = useState(300);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  const startGame = () => {
    setGameState('PLAYING');
    setBirdY(300);
    setVelocity(0);
    setObstacles([{ x: 500, topHeight: 200, passed: false }]);
    setScore(0);
  };

  const jump = useCallback(() => {
    if (gameState === 'PLAYING') {
      setVelocity(JUMP_STRENGTH);
    } else if (gameState === 'START' || gameState === 'GAME_OVER') {
      startGame();
    }
  }, [gameState]);

  // Input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') jump();
    };
    const handleTouch = () => jump();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [jump]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const loop = () => {
      if (!containerRef.current) return;
      const height = containerRef.current.offsetHeight;

      // Physics
      setVelocity((v) => v + GRAVITY);
      setBirdY((y) => Math.min(Math.max(y + velocity, 0), height - BIRD_SIZE));

      // Obstacles
      setObstacles((prev) => {
        let newObstacles = prev
          .map((obs) => ({ ...obs, x: obs.x - OBSTACLE_SPEED }))
          .filter((obs) => obs.x + OBSTACLE_WIDTH > -100);

        // Spawn new obstacle
        const lastObstacle = newObstacles[newObstacles.length - 1];
        if (lastObstacle && lastObstacle.x < containerRef.current!.offsetWidth - 300) {
          const minHeight = 50;
          const maxHeight = height - GAP_SIZE - minHeight;
          const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
          newObstacles.push({ x: containerRef.current!.offsetWidth, topHeight: randomHeight, passed: false });
        }

        return newObstacles;
      });

      // Collision & Scoring logic is handled in a separate effect or check below to keep render clean
      // but inside the loop is most accurate for "hit" detection
      checkCollision(height);

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, velocity]);

  const checkCollision = (containerHeight: number) => {
    // Floor/Ceiling
    if (birdY >= containerHeight - BIRD_SIZE || birdY <= 0) {
      setGameState('GAME_OVER');
    }

    // Obstacles
    setObstacles((prev) => {
      const nextObstacles = [...prev];
      for (const obs of nextObstacles) {
        // Hitbox logic
        const birdLeft = 50; // Fixed bird X position
        const birdRight = 50 + BIRD_SIZE;
        const birdTop = birdY;
        const birdBottom = birdY + BIRD_SIZE;

        const obsLeft = obs.x;
        const obsRight = obs.x + OBSTACLE_WIDTH;
        
        // Check collision
        if (birdRight > obsLeft && birdLeft < obsRight) {
          if (birdTop < obs.topHeight || birdBottom > obs.topHeight + GAP_SIZE) {
             setGameState('GAME_OVER');
          }
        }

        // Score update
        if (!obs.passed && birdLeft > obsRight) {
          obs.passed = true;
          setScore((s) => {
            const newScore = s + 1;
            if (newScore >= WIN_SCORE) {
                setGameState('WON');
                setTimeout(onComplete, 1000); // Delay slightly before transition
            }
            return newScore;
          });
        }
      }
      return nextObstacles;
    });
  };

  return (
    <div 
      ref={containerRef} 
      onClick={jump}
      className="relative w-full h-full bg-slate-900 overflow-hidden select-none cursor-pointer"
    >
      {/* Background with simple scrolling effect hint */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 w-full h-12 bg-slate-800 border-t-4 border-slate-600 z-10"></div>

      {/* Bird / Rocket */}
      <div 
        style={{ 
          top: birdY, 
          left: 50,
          width: BIRD_SIZE,
          height: BIRD_SIZE,
          transform: `rotate(${Math.min(Math.max(velocity * 3, -25), 25)}deg)`
        }} 
        className="absolute z-20 transition-transform duration-75 flex items-center justify-center text-3xl"
      >
        🚀
      </div>

      {/* Obstacles */}
      {obstacles.map((obs, i) => (
        <React.Fragment key={i}>
          {/* Top Pipe */}
          <div 
            style={{ 
              left: obs.x, 
              width: OBSTACLE_WIDTH, 
              height: obs.topHeight 
            }}
            className="absolute top-0 bg-gradient-to-b from-purple-600 to-indigo-600 border-x-2 border-b-2 border-indigo-400 rounded-b-xl shadow-lg"
          ></div>
          {/* Bottom Pipe */}
          <div 
             style={{ 
               left: obs.x, 
               width: OBSTACLE_WIDTH, 
               top: obs.topHeight + GAP_SIZE,
               bottom: 0
             }}
             className="absolute bg-gradient-to-t from-purple-600 to-indigo-600 border-x-2 border-t-2 border-indigo-400 rounded-t-xl shadow-lg"
          ></div>
        </React.Fragment>
      ))}

      {/* UI Layer */}
      <div className="absolute top-4 left-0 right-0 flex justify-center z-30 pointer-events-none">
         <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-white font-bold text-2xl shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {score} / {WIN_SCORE}
         </div>
      </div>

      {/* Start Screen */}
      {gameState === 'START' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-40 text-white text-center p-4">
          <div className="bg-slate-800/90 p-8 rounded-3xl border-4 border-yellow-400 shadow-2xl animate-pop-in max-w-sm w-full">
            <h1 className="text-3xl font-bold text-yellow-300 mb-2">Misi Menuju 2026</h1>
            <p className="text-slate-300 mb-6">Bantu roket melewati {WIN_SCORE} rintangan untuk membuka pesta tahun baru!</p>
            <div className="flex flex-col gap-3">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition">
                <Play className="w-5 h-5" /> Klik Spasi / Layar
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-500">Tap layar atau tekan Spasi untuk terbang</p>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm flex items-center justify-center z-40">
           <div className="bg-white text-slate-900 p-8 rounded-3xl text-center shadow-2xl animate-pop-in border-4 border-red-500">
              <h2 className="text-4xl font-black text-red-500 mb-2">NABRAK! 💥</h2>
              <p className="text-lg text-slate-600 mb-6">Yah, gagal sampai 2026 nih.</p>
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="bg-slate-900 text-white py-3 px-8 rounded-full font-bold hover:bg-slate-800 flex items-center gap-2 mx-auto transition hover:scale-105"
              >
                 <RotateCcw className="w-5 h-5" /> Coba Lagi
              </button>
           </div>
        </div>
      )}

      {/* Win Screen (Brief) */}
      {gameState === 'WON' && (
        <div className="absolute inset-0 bg-yellow-400/90 flex items-center justify-center z-50">
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg animate-bounce text-center">
              BERHASIL! <br/>
              <span className="text-3xl font-normal">Selamat Datang 2026</span>
            </h1>
        </div>
      )}
    </div>
  );
};

export default IntroGame;