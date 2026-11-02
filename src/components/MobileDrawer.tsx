import React, { useEffect } from 'react';
import { Radio, Calendar, HeartHandshake, Music, BookOpen, Info, X, User, ChevronRight, Play } from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { PWAInstallButton } from './PWAInstallButton';

export const MobileDrawer: React.FC<{ isOpen: boolean; onClose: () => void; isLoggedIn: boolean }> = ({ isOpen, onClose, isLoggedIn }) => {
  const { setActiveTab, activeTab } = useRadio();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const navItems = [
    { id: 'ao-vivo', path: '/inicio', label: 'Início', icon: Radio },
    { id: 'programacao', path: '/programacao', label: 'Programação', icon: Calendar },
    { id: 'oracao', path: '/oracao', label: 'Mural de Oração', icon: HeartHandshake },
    { id: 'pedir-hino', path: '/pedir-hino', label: 'Pedir Hino', icon: Music },
    { id: 'devocionais', path: '/devocionais', label: 'Palavra do Dia', icon: BookOpen },
    { id: 'sobre', path: '/sobre', label: 'Sobre', icon: Info },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-4/5 max-w-sm bg-[#0B2923] border-r border-amber-500/30 h-full flex flex-col p-6 shadow-2xl z-10 animate-in slide-in-from-left shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-[var(--gold)] flex items-center justify-center">
                 <Radio className="w-6 h-6 text-[var(--gold)]" />
             </div>
             <span className="font-serif-title text-xl font-bold text-white tracking-wider">Voz da Fé</span>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--gold)] hover:bg-[var(--gold)]/20 rounded-full"><X className="w-8 h-8" /></button>
        </div>
        
        <div className="mb-8 flex justify-center">
            <PWAInstallButton />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-4">
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
                    onClose();
                    window.history.pushState(null, '', item.path);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                  isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-100 hover:bg-[#0f3b36]'
                }`}
              >
                <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-[var(--gold)]" />
                    {item.label}
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400" />
              </a>
            );
          })}
        </nav>
        
        
        {/* Login Link */}
        <div className="mt-auto pt-6 border-t border-[var(--gold)]/20">
            <a href={isLoggedIn ? "/perfil" : "/login"} 
               onClick={(e) => { e.preventDefault(); setActiveTab(isLoggedIn ? 'perfil' : 'login'); onClose(); window.history.pushState(null, '', isLoggedIn ? '/perfil' : '/login'); }}
               className="flex items-center justify-between px-4 py-4 text-slate-100 hover:bg-[#0f3b36] rounded-xl text-lg">
                <div className="flex items-center gap-4">
                    <User className="w-6 h-6 text-[var(--gold)]" />
                    {isLoggedIn ? 'Meu Perfil' : 'Entrar'}
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400" />
            </a>
        </div>

        {/* Live CTA */}
        <div className="mt-8 mb-6">
            <a href="/inicio" className="flex items-center justify-center gap-3 w-full bg-[var(--gold)] text-slate-950 font-bold py-4 rounded-2xl text-lg">
                <Play className="w-6 h-6 fill-slate-950" />
                Ouça ao Vivo
            </a>
        </div>
        
        <div className="mt-auto flex justify-center pb-4">
            <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
