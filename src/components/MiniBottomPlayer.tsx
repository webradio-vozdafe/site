import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronUp, Sliders, Moon } from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { auth } from '../lib/firebase';

export const MiniBottomPlayer: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    currentShow,
    currentTrackInfo,
    setIsControlPanelOpen,
    radioData,
    sleepTimerRemainingSec,
    setSleepTimer
  } = useRadio();

  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => setIsLoggedIn(!!user));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowMiniPlayer(true);
      } else {
        setShowMiniPlayer(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showMiniPlayer) return null;

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(16, 43, 40, 0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(230, 184, 107, 0.3)',
        boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.25)',
        padding: '10px 16px',
        color: '#fffefa'
      }}
      className="studio-floating-panel"
    >
      <div className="wrap flex items-center justify-between gap-4">
        {/* Left: Indicator & Program */}
        <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={scrollToHero}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              border: '1px solid rgba(230, 184, 107, 0.4)',
              background: 'rgba(230, 184, 107, 0.1)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            {radioData?.capa_musica ? (
              <img
                src={radioData.capa_musica}
                alt="Capa"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className={`live-dot ${isPlaying ? 'playing' : ''}`} />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 750,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)'
                }}
              >
                {isPlaying ? (radioData?.status ? String(radioData.status) : 'Ao Vivo no Ar') : 'Rádio Pausada'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>
                • {radioData?.titulo || 'FM 104.9'}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '14px',
                fontWeight: 400,
                color: '#fffefa',
                margin: '1px 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {radioData?.musica_atual || (isPlaying ? currentTrackInfo.title : currentShow.title)}
            </p>
          </div>
        </div>

        {/* Center: Play/Pause button */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--gold)',
              color: '#192c26',
              display: 'grid',
              placeItems: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(230, 184, 107, 0.35)',
              transition: 'transform 0.2s ease'
            }}
            aria-label={isPlaying ? 'Pausar rádio' : 'Ouvir a rádio'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#192c26] border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Right: Volume & Scroll to Top */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={toggleMute}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
              title={isMuted ? 'Desmutar' : 'Mutar'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '70px', height: '4px', accentColor: 'var(--gold)', cursor: 'pointer' }}
            />
          </div>

          {/* Active Sleep Timer Indicator */}
          {sleepTimerRemainingSec && sleepTimerRemainingSec > 0 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold"
              title="Temporizador de Sono ativo"
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {Math.floor(sleepTimerRemainingSec / 60)}:{(sleepTimerRemainingSec % 60).toString().padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setSleepTimer(null)}
                className="text-amber-400 hover:text-white ml-0.5 cursor-pointer font-sans text-[10px]"
                title="Desativar temporizador de sono"
              >
                ✕
              </button>
            </div>
          )}

          {isLoggedIn && (
            <button
              onClick={() => setIsControlPanelOpen(true)}
              style={{
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(230, 184, 107, 0.4)',
                background: 'rgba(230, 184, 107, 0.1)',
                color: 'var(--gold)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Abrir Painel de Controle do Estúdio"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Estúdio</span>
            </button>
          )}

          <button
            onClick={scrollToHero}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Voltar ao início"
          >
            <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
            <span className="hidden md:inline">Início</span>
          </button>
        </div>
      </div>
    </div>
  );
};
