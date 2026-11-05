import React, { useEffect, useState } from 'react';
import { WifiOff, RotateCcw, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestoredToast, setShowRestoredToast] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);

  const checkOfflineCount = () => {
    try {
      const prayers = localStorage.getItem('vozdafe_pending_prayers');
      const songs = localStorage.getItem('vozdafe_pending_songs');
      const pCount = prayers ? JSON.parse(prayers).length : 0;
      const sCount = songs ? JSON.parse(songs).length : 0;
      setOfflineCount(pCount + sCount);
    } catch {
      setOfflineCount(0);
    }
  };

  useEffect(() => {
    checkOfflineCount();
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredToast(true);
      setTimeout(() => setShowRestoredToast(false), 5000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      checkOfflineCount();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showRestoredToast) {
    return (
      <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-3 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 p-3.5 text-xs text-emerald-200 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="font-bold text-white">Conexão Reestabelecida!</p>
          <p className="text-[11px] text-emerald-300/80">Sua internet voltou. O aplicativo está sincronizado com a Rádio Vóz da Fé.</p>
        </div>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center justify-between gap-3 rounded-2xl bg-amber-950/95 border border-amber-500/40 p-3.5 text-xs text-amber-200 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <div>
          <p className="font-bold text-white flex items-center gap-1">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Modo Offline PWA</span>
          </p>
          <p className="text-[11px] text-amber-300/80">
            {offlineCount > 0
              ? `Você está sem internet. ${offlineCount} pedido(s) salvo(s) aguardando re-sincronização.`
              : 'Você está sem internet. O aplicativo continuará funcionando com dados salvos.'}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          if (navigator.onLine) {
            setIsOnline(true);
            setShowRestoredToast(true);
            setTimeout(() => setShowRestoredToast(false), 5000);
          }
        }}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider flex-shrink-0 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reconectar</span>
      </button>
    </div>
  );
};
