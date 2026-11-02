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
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { MobileDrawer } from './MobileDrawer';
import { PWAInstallButton } from './PWAInstallButton';


export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, isPlaying, togglePlay, setIsControlPanelOpen, stationSettings } = useRadio();
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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'ao-vivo', path: '/inicio', label: 'Ao Vivo', icon: Radio },
    { id: 'programacao', path: '/programacao', label: 'Programação', icon: Calendar },
    { id: 'oracao', path: '/oracao', label: 'Mural de Oração', icon: HeartHandshake },
    { id: 'pedir-hino', path: '/pedir-hino', label: 'Pedir Hino', icon: Music },
    { id: 'devocionais', path: '/devocionais', label: 'Devocionais & Mensagens', icon: BookOpen },
    { id: 'sobre', path: '/sobre', label: 'Sobre', icon: Info },
  ];

  const handleSelectTab = (id: string, customPath?: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const targetPath = customPath || (id === 'ao-vivo' ? '/inicio' : `/${id}`);
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg shadow-black/40 px-[18px] sm:px-6 lg:px-8 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Station Title */}
          <a
            href="/inicio"
            onClick={(e) => {
              e.preventDefault();
              handleSelectTab('ao-vivo', '/inicio');
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-950/80 border border-amber-500/40 p-1 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
              <img
                src="/assets/aistudio/Logotipo_Dourado_Voz_da_F__4a6f8aec.png"
                alt="Logo Rádio Voz da Fé"
                className="w-full h-full object-contain"
              />
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
          </a>

          {/* Desktop Nav Links */}
          <nav id="site-nav" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectTab(item.id, item.path);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  {item.label}
                </a>
              );
            })}

            {isLoggedIn ? (
              <a
                href="/perfil"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTab('perfil', '/perfil');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'perfil'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <User className={`w-4 h-4 ${activeTab === 'perfil' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>Perfil</span>
              </a>
            ) : (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTab('login', '/login');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <User className={`w-4 h-4 ${activeTab === 'login' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>Entrar</span>
              </a>
            )}
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

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Direct WhatsApp Studio */}
            <a
              href={buildWhatsAppUrl(stationSettings.whatsapp, 'Paz do Senhor! Estou ouvindo a Rádio Vóz da Fé e quero deixar meu abraço!')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
              title={`WhatsApp do Estúdio: ${stationSettings.whatsapp}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* User Profile & Studio Panel or Login */}
            {isLoggedIn ? (
              <>
                <a
                  href="/perfil"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectTab('perfil', '/perfil');
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-600 text-xs font-medium transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Perfil</span>
                </a>
                <button
                  onClick={() => {
                    setIsControlPanelOpen(true);
                    handleSelectTab('ao-vivo', '/estudio');
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-600 text-xs font-medium transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Painel do Estúdio</span>
                </button>
              </>
            ) : (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectTab('login', '/login');
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-medium transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </a>
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
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isLoggedIn={isLoggedIn} />
    </header>
  );
};
