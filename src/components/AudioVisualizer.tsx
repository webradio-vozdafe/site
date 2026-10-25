import React, { useRef, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';

interface AudioVisualizerProps {
  isPlaying?: boolean;
  barCount?: number;
  heightClass?: string;
  useCanvas?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isPlaying: propIsPlaying,
  barCount = 10,
  heightClass = 'h-5',
  useCanvas = true
}) => {
  const { isPlaying: contextIsPlaying } = useRadio();
  const isPlaying = propIsPlaying !== undefined ? propIsPlaying : contextIsPlaying;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!useCanvas || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || (barCount * 5);
    const height = rect.height || 20;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const count = barCount;
      const spacing = 2;
      const barWidth = Math.max(2, (width - (count - 1) * spacing) / count);

      for (let i = 0; i < count; i++) {
        let barHeight = 4;
        if (isPlaying) {
          const wave1 = Math.sin(phase + i * 0.55) * 0.5 + 0.5;
          const wave2 = Math.cos(phase * 1.25 + i * 0.75) * 0.5 + 0.5;
          const wave = (wave1 * 0.6 + wave2 * 0.4);
          barHeight = 4 + wave * (height - 6);
        }

        const x = i * (barWidth + spacing);
        const y = height - barHeight;

        // Gradient color for audio visualizer bars
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, '#e6b86b');
        grad.addColorStop(1, '#fdf4dc');

        ctx.fillStyle = isPlaying ? grad : '#64748b';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, barWidth, barHeight, 1.5);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.09;
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [isPlaying, barCount, useCanvas]);

  return (
    <div className={`flex items-center ${heightClass}`} title={isPlaying ? "Transmissão ao vivo em andamento" : "Transmissão pausada"}>
      <canvas
        ref={canvasRef}
        style={{ width: `${barCount * 5}px`, height: '20px' }}
        className="block"
      />
    </div>
  );
};
