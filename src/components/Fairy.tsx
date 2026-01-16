import { useEffect, useState } from 'react';
import './Fairy.css';

export function Fairy() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [target, setTarget] = useState({ x: 200, y: 200 });
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const pickNewTarget = () => {
      const padding = 100;
      const newTarget = {
        x: padding + Math.random() * (window.innerWidth - padding * 2),
        y: padding + Math.random() * (window.innerHeight - padding * 2),
      };
      setTarget(newTarget);
      setFlip(newTarget.x < position.x);
    };

    pickNewTarget();
    const interval = setInterval(pickNewTarget, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      setPosition(prev => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const speed = 0.02;
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });
    };

    const animationFrame = setInterval(animate, 16);
    return () => clearInterval(animationFrame);
  }, [target]);

  return (
    <div
      className={`fairy ${flip ? 'flip' : ''}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="fairy-body">
        <div className="fairy-glow"></div>
        <div className="fairy-wings">
          <div className="wing wing-left"></div>
          <div className="wing wing-right"></div>
        </div>
        <div className="fairy-figure">
          <div className="fairy-head"></div>
          <div className="fairy-dress"></div>
        </div>
        <div className="sparkles">
          <span className="sparkle">✦</span>
          <span className="sparkle">✧</span>
          <span className="sparkle">✦</span>
          <span className="sparkle">✧</span>
          <span className="sparkle">✦</span>
        </div>
      </div>
    </div>
  );
}
