import React, { useState } from 'react';
import IntroGame from './components/IntroGame';
import Celebration from './components/Celebration';
import Transition from './components/Transition';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('INTRO_GAME');

  const handleGameComplete = () => {
    setGameState('TRANSITION');
  };

  const handleTransitionComplete = () => {
    setGameState('CELEBRATION');
  };

  const handleRestart = () => {
    setGameState('INTRO_GAME');
  };

  return (
    <div className="w-full h-screen font-sans">
      {gameState === 'INTRO_GAME' && (
        <IntroGame onComplete={handleGameComplete} />
      )}
      
      {gameState === 'TRANSITION' && (
        <Transition onComplete={handleTransitionComplete} />
      )}

      {gameState === 'CELEBRATION' && (
        <Celebration onRestart={handleRestart} />
      )}
    </div>
  );
};

export default App;