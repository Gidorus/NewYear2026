import React, { useEffect, useRef } from 'react';

const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; vx: number; vy: number; color: string; life: number; size: number }[] = [];
    const colors = ['#FF0055', '#FFDD00', '#00FFDD', '#AA00FF', '#FFFFFF'];

    const createFirework = (x: number, y: number) => {
      const particleCount = 60;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 4 + 1;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 100,
          size: Math.random() * 3 + 1,
        });
      }
    };

    const animate = () => {
      // Fade out effect for trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      // Randomly spawn fireworks
      if (Math.random() < 0.05) {
        createFirework(Math.random() * width, Math.random() * height * 0.5);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Gravity
        p.life--;
        p.size *= 0.98;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

export default FireworksCanvas;