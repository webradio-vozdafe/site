import React, { useEffect } from 'react';
import {
  Home,
  Calendar,
  HeartHandshake,
  Music,
  BookOpen,
  Info,
  User,
  ChevronRight,
  Play,
  X
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { PWAInstallButton } from './PWAInstallButton';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const MobileDrawer: React.FC<{ isOpen: boolean; onClose: () => void; isLoggedIn: boolean }> = ({
  isOpen,
  onClose,
  isLoggedIn
}) => {
  const { setActiveTab, activeTab, isPlaying, togglePlay, stationSettings } = useRadio();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { id: 'ao-vivo', path: '/inicio', label: 'Início', icon: Home },
    { id: 'programacao', path: '/programacao', label: 'Programação', icon: Calendar },
    { id: 'oracao', path: '/oracao', label: 'Mural de Oração', icon: HeartHandshake },
    { id: 'pedir-hino', path: '/pedir-hino', label: 'Pedir Hino', icon: Music },
    { id: 'devocionais', path: '/devocionais', label: 'Palavra do Dia', icon: BookOpen },
    { id: 'sobre', path: '/sobre', label: 'Sobre', icon: Info },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-center items-start overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Background Overlay dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Card Shell matching Mockup layout */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#0B2E27] via-[#092520] to-[#051A16] border-2 border-amber-400/40 rounded-3xl p-5 shadow-[0_0_35px_rgba(217,150,24,0.25)] z-10 flex flex-col gap-4 my-auto">
        
        {/* Header with Emblem & Hamburger toggle */}
        <div className="flex items-center justify-between pt-1 pb-2 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--gold)] p-0.5 bg-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20">
              <img
                src="/assets/aistudio/Logotipo_Dourado_Voz_da_F__4a6f8aec.png"
                alt="Emblema Rádio Voz da Fé"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif-title text-2xl font-extrabold text-white tracking-wide drop-shadow">
              Voz da Fé
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Fechar menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PWA Install Promo if available */}
        <div className="flex justify-center -mb-1">
          <PWAInstallButton variant="card" />
        </div>

        {/* Inner Card Container for Menu List */}
        <div className="bg-[#06201B]/90 rounded-2xl border border-amber-500/30 p-2 shadow-inner space-y-1.5">
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
                  if (item.id === 'ao-vivo' || item.path === '/inicio') {
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
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F7C644] via-[#EEB528] to-[#D99618] text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-white hover:bg-white/10 font-medium'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-6 h-6 ${isActive ? 'text-slate-950' : 'text-white'}`} />
                  <span className="text-base sm:text-lg">{item.label}</span>
                </div>
                {!isActive && <ChevronRight className="w-5 h-5 text-white/70" />}
              </a>
            );
          })}

          {/* User Profile or Login item */}
          <a
            href={isLoggedIn ? "/perfil" : "/login"}
            onClick={(e) => {
              e.preventDefault();
              const targetTab = isLoggedIn ? 'perfil' : 'login';
              const targetPath = isLoggedIn ? '/perfil' : '/login';
              setActiveTab(targetTab);
              onClose();
              window.history.pushState(null, '', targetPath);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
              (activeTab === 'login' || activeTab === 'perfil')
                ? 'bg-gradient-to-r from-[#F7C644] via-[#EEB528] to-[#D99618] text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'text-white hover:bg-white/10 font-medium'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <User className={`w-6 h-6 ${(activeTab === 'login' || activeTab === 'perfil') ? 'text-slate-950' : 'text-white'}`} />
              <span className="text-base sm:text-lg">{isLoggedIn ? 'Meu Perfil' : 'Entrar'}</span>
            </div>
            {!(activeTab === 'login' || activeTab === 'perfil') && <ChevronRight className="w-5 h-5 text-white/70" />}
          </a>
        </div>

        {/* Ouça ao Vivo Action Button */}
        <div className="mt-1">
          <button
            type="button"
            onClick={() => {
              togglePlay();
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-full border-2 border-amber-400 bg-amber-500/15 hover:bg-amber-500/25 flex items-center justify-center gap-3 font-bold text-lg text-amber-300 transition-all shadow-[0_0_20px_rgba(230,184,107,0.2)] active:scale-95 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span>{isPlaying ? 'Pausar Transmissão' : 'Ouça ao Vivo'}</span>
          </button>
        </div>

        {/* Social Networks Row */}
        <div className="flex items-center justify-center gap-3.5 pt-2">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-amber-400/70 bg-amber-500/10 hover:bg-amber-500/25 flex items-center justify-center text-amber-300 transition-all shadow-sm hover:scale-105"
            aria-label="Canal no YouTube"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-amber-400/70 bg-amber-500/10 hover:bg-amber-500/25 flex items-center justify-center text-amber-300 transition-all shadow-sm hover:scale-105"
            aria-label="Página no Facebook"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-amber-400/70 bg-amber-500/10 hover:bg-amber-500/25 flex items-center justify-center text-amber-300 transition-all shadow-sm hover:scale-105"
            aria-label="Perfil no Instagram"
          >
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a
            href={buildWhatsAppUrl(stationSettings.whatsapp, 'Paz do Senhor! Gostaria de falar com o estúdio da Rádio Vóz da Fé.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-amber-400/70 bg-amber-500/10 hover:bg-amber-500/25 flex items-center justify-center text-amber-300 transition-all shadow-sm hover:scale-105"
            aria-label="WhatsApp Oficial"
          >
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>
            </svg>
          </a>
        </div>

        {/* Brand Footer Divider */}
        <div className="flex items-center justify-center gap-3 pt-1 pb-1">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
          <span className="font-serif-title text-base font-bold tracking-widest text-amber-200/90">
            Voz da Fé
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
        </div>

      </div>
    </div>
  );
};

