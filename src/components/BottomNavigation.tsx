import React from 'react';
import { Radio, Calendar, HeartHandshake, Music, Play, Pause } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export const BottomNavigation: React.FC = () => {
  const { setActiveTab, activeTab, isPlaying, togglePlay } = useRadio();

  const navItems = [
    { id: 'ao-vivo', path: '/inicio', label: 'Início', icon: Radio },
    { id: 'programacao', path: '/programacao', label: 'Grade', icon: Calendar },
    { id: 'oracao', path: '/oracao', label: 'Oração', icon: HeartHandshake },
    { id: 'pedir-hino', path: '/pedir-hino', label: 'Hinos', icon: Music },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B2923] border-t border-amber-500/30 flex justify-around items-center p-2 pb-safe lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <a
            key={item.id}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.id);
              window.history.pushState(null, '', item.path);
              if (item.id === 'ao-vivo') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                const el = document.getElementById(item.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }
            }}
            className={`flex flex-col items-center gap-1 p-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </a>
        );
      })}
       <button
        onClick={togglePlay}
        className="flex flex-col items-center gap-1 p-2 text-[10px] font-medium text-amber-400"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        Ao Vivo
      </button>
    </div>
  );
};
