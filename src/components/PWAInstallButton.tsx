import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already running as an installed PWA standalone app, hide button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
    }
  };

  // Chromium / Android / Windows / Mac Desktop flow
  if (isInstallable) {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold shadow-md shadow-amber-500/10 cursor-pointer transition-all active:scale-95"
          title="Baixar e instalar o aplicativo Rádio Vóz da Fé no seu dispositivo"
        >
          {installedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>App Instalado!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Instalar App</span>
            </>
          )}
        </button>
      </>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold shadow-md cursor-pointer transition-all active:scale-95"
          title="Instalar Rádio Vóz da Fé no iOS iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Fechar instrução"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Instalar no iPhone / iPad</h3>
                  <p className="text-xs text-slate-400">Rádio Vóz da Fé no seu celular</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">1</span>
                  <p>Toque no ícone de <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> na barra inferior do Safari.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">2</span>
                  <p>Role para baixo e selecione <PlusSquare className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> <strong>Adicionar à Tela de Início</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">3</span>
                  <p>Confirme clicando em <strong>Adicionar</strong> no canto superior direito.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 text-xs transition-colors shadow-md"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
