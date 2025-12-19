import React, { useEffect, useState } from 'react';

interface TransitionProps {
  onComplete: () => void;
}

const Transition: React.FC<TransitionProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setCount(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <div key={count} className="animate-pop-in relative">
        <h1 
          className="text-[10rem] md:text-[15rem] font-black text-white leading-none text-center"
          style={{ 
             textShadow: `0 0 50px ${count === 3 ? 'red' : count === 2 ? 'yellow' : 'cyan'}`
          }}
        >
          {count > 0 ? count : (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
                2026!
            </span>
          )}
        </h1>
      </div>
    </div>
  );
};

export default Transition;