import React from 'react';
import { useRadio } from '../context/RadioContext';

interface AudioVisualizerProps {
  isPlaying?: boolean;
  barCount?: number;
  heightClass?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isPlaying: propIsPlaying,
  barCount = 7,
  heightClass = 'h-5'
}) => {
  const { isPlaying: contextIsPlaying } = useRadio();
  const isPlaying = propIsPlaying !== undefined ? propIsPlaying : contextIsPlaying;

  const heights = [12, 18, 8, 20, 14, 10, 16, 12, 19, 9, 15, 11, 17, 13, 7, 18, 14, 9, 16, 12, 15, 10, 20, 13];
  const activeHeights = heights.slice(0, barCount);

  if (!isPlaying) {
    return (
      <div className={`flex items-center gap-1 ${heightClass}`}>
        {activeHeights.map((_, i) => (
          <span
            key={i}
            style={{ height: '4px' }}
            className="w-1 bg-slate-600 rounded-full transition-all"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${heightClass} items-end`} title="Transmissão ao vivo em andamento">
      {activeHeights.map((h, i) => (
        <span
          key={i}
          style={{ height: `${Math.max(6, h * (i % 2 === 0 ? 1 : 0.7))}px` }}
          className="w-1 bg-[var(--gold)] rounded-full animate-pulse"
        />
      ))}
    </div>
  );
};
