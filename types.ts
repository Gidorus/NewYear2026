export type GameState = 'INTRO_GAME' | 'TRANSITION' | 'CELEBRATION';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

export interface Target {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
}
