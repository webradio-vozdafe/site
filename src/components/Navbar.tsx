import React, { useState, useEffect } from 'react';
import {
  Radio,
  Calendar,
  HeartHandshake,
  Music,
  BookOpen,
  Info,
  Menu,
  X,
  MessageCircle,
  Volume2,
  Users,
  User
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { RADIO_STATION } from '../data/radioData';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, isPlaying, togglePlay, setIsControlPanelOpen } = useRadio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  const navItems = [
    { id: 'ao-vivo', label: 'Ao Vivo', icon: Radio },
    { id: 'programacao', label: 'Programação', icon: Calendar },
    { id: 'oracao', label: 'Mural de Oração', icon: HeartHandshake },
    { id: 'pedir-hino', label: 'Pedir Hino', icon: Music },
    { id: 'devocionais', label: 'Devocionais & Mensagens', icon: BookOpen },
    { id: 'sobre', label: 'Sobre', icon: Info },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-amber-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Station Title */}
          <div
            onClick={() => handleSelectTab('ao-vivo')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
              <Radio className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-wider text-slate-100 group-hover:text-amber-400 transition-colors">
                  VOZ DA FÉ
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  FM 104.9
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block tracking-wide">
                A rádio que abençoa a sua vida
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav id="site-nav" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Indicator Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-xs text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400">NO AR</span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Users className="w-3 h-3 text-amber-400" />
                {RADIO_STATION.onlineListeners.toLocaleString('pt-BR')} ouvindo
              </span>
            </div>

            {/* Direct WhatsApp Studio */}
            <a
              href={`https://wa.me/5511987654321?text=${encodeURIComponent('Paz do Senhor! Estou ouvindo a Rádio Vóz da Fé e quero deixar meu abraço!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
              title="WhatsApp do Estúdio"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* User Profile & Studio Panel or Login */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab('perfil');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-600 text-xs font-medium transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Perfil</span>
                </button>
                <button
                  onClick={() => {
                    setIsControlPanelOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-600 text-xs font-medium transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Painel do Estúdio</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-medium transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            )}


            {/* Quick Play/Pause Header Button */}
            <button
              onClick={togglePlay}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                  : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/40'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlaying ? 'Pausar' : 'Ouvir Agora'}</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={togglePlay}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isPlaying ? 'Pausar' : 'Ouvir'}
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsControlPanelOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                <Users className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-amber-500/20 bg-slate-950/98 px-4 pt-2 pb-6 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Transmissão Ao Vivo • FM 104.9
            </span>
            <span className="text-amber-400 font-medium">
              {RADIO_STATION.onlineListeners.toLocaleString('pt-BR')} ouvintes
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                {item.label}
              </button>
            );
          })}

          {isLoggedIn && (
            <div className="pt-2 space-y-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveTab('perfil');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:bg-slate-900"
              >
                <User className="w-5 h-5 text-amber-400" />
                Meu Perfil
              </button>
              <button
                onClick={() => {
                  setIsControlPanelOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:bg-slate-900"
              >
                <Users className="w-5 h-5 text-amber-400" />
                Painel do Estúdio
              </button>
            </div>
          )}

          <div className="pt-3">
            <a
              href={`https://wa.me/5511987654321?text=${encodeURIComponent('Paz do Senhor! Estou ouvindo a Rádio Vóz da Fé!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-emerald-950"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp da Rádio
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
