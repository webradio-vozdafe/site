import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share2, PlusSquare, Monitor } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'pill' | 'button' | 'card';
  className?: string;
  style?: React.CSSProperties;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'pill',
  className = '',
  style
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already running as an installed PWA standalone app, hide button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 4000);
      }
    } else {
      setShowGuide(true);
    }
  };

  const getButtonContent = () => {
    if (installedSuccess) {
      return (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Aplicativo Instalado!</span>
        </>
      );
    }
    if (isIOS) {
      return (
        <>
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Instalar no iOS</span>
        </>
      );
    }
    return (
      <>
        <Download className="w-4 h-4 text-amber-400 animate-bounce" />
        <span>Instalar</span>
      </>
    );
  };

  const baseStyle =
    variant === 'card'
      ? 'w-full py-3 px-4 rounded-2xl border border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-amber-600/20 hover:bg-amber-500/30 text-amber-300 text-sm font-bold shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95'
      : variant === 'button'
      ? 'px-4 py-2 rounded-xl border border-amber-500/60 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2'
      : 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold shadow-md shadow-amber-500/10 cursor-pointer transition-all active:scale-95';

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`${baseStyle} ${className}`}
        style={{
          marginBottom: '529px',
          marginLeft: '0px',
          marginRight: '50px',
          ...style
        }}
        title="Baixar e instalar o aplicativo Rádio Vóz da Fé no celular ou computador"
      >
        {getButtonContent()}
      </button>

      {/* Guide Modal for iOS Safari and General Android / Desktop Browsers */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar instrução"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {isIOS ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {isIOS ? 'Instalar no iPhone / iPad' : 'Instalar no Dispositivo'}
                </h3>
                <p className="text-xs text-slate-400">Rádio Vóz da Fé direta da tela inicial</p>
              </div>
            </div>

            {isIOS ? (
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
            ) : (
              <div className="space-y-3 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">1</span>
                  <p>Abra o menu do navegador (<strong>3 pontinhos ⋮</strong> no topo ou barra de endereço).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">2</span>
                  <p>Clique em <strong>Instalar aplicativo</strong> ou <strong>Adicionar à Tela Inicial</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">3</span>
                  <p>Acesse a rádio a qualquer momento sem precisar abrir o navegador!</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 text-xs transition-colors shadow-md cursor-pointer"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
