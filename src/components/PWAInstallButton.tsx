import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  X,
  Check,
  Share2,
  PlusSquare,
  Monitor,
  Copy,
  Sparkles,
  Info
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'pill' | 'button' | 'card';
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'pill',
  className = '',
  style,
  label = 'Instalar App'
}) => {
  const {
    isInstalled,
    isInstallable,
    isIOS,
    isAndroid,
    isInAppBrowser,
    install
  } = usePWAInstall();

  const [showGuide, setShowGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'android' | 'ios' | 'desktop'>('auto');

  // If already running inside standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // If native prompt is captured, trigger it immediately
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        setShowGuide(false);
        setTimeout(() => setInstalledSuccess(false), 5000);
        return;
      }
    }

    // Set initial guide tab based on device detection
    if (isIOS) {
      setActiveTab('ios');
    } else if (isAndroid) {
      setActiveTab('android');
    } else {
      setActiveTab('auto');
    }

    setShowGuide(true);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const urlToCopy = window.location.origin;
      navigator.clipboard.writeText(urlToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const getButtonContent = () => {
    if (installedSuccess) {
      return (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>App Instalado!</span>
        </>
      );
    }
    return (
      <>
        <Download className="w-4 h-4 text-amber-400 animate-bounce" />
        <span>{label}</span>
      </>
    );
  };

  const baseStyle =
    variant === 'card'
      ? 'w-full py-3.5 px-4 rounded-2xl border border-amber-400/50 bg-gradient-to-r from-amber-500/25 via-amber-500/15 to-amber-600/25 hover:bg-amber-500/35 text-amber-300 text-sm font-bold shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95'
      : variant === 'button'
      ? 'px-4 py-2 rounded-xl border border-amber-500/60 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2'
      : 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold shadow-md shadow-amber-500/10 cursor-pointer transition-all active:scale-95';

  const resolvedTab =
    activeTab === 'auto'
      ? isIOS
        ? 'ios'
        : isAndroid
        ? 'android'
        : 'desktop'
      : activeTab;

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`${baseStyle} ${className}`}
        style={style}
        title="Instalar aplicativo Rádio Vóz da Fé no celular, tablet ou computador"
        aria-label="Instalar aplicativo Rádio Vóz da Fé"
      >
        {getButtonContent()}
      </button>

      {/* Installation Guide & Prompt Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#092520] border-2 border-amber-500/40 p-6 shadow-2xl text-slate-100 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar instrução de instalação"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with App Logo */}
            <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-amber-500/20">
              <div className="w-14 h-14 rounded-2xl bg-[#051A16] border border-amber-400/50 p-1 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                <img
                  src="/pwa-192x192.png"
                  alt="Ícone Rádio Vóz da Fé"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div>
                <h3 id="pwa-install-title" className="font-serif-title font-bold text-lg text-white">
                  Instalar Rádio Vóz da Fé
                </h3>
                <p className="text-xs text-amber-300/80">
                  Ouça com 1 toque na tela inicial, mesmo offline!
                </p>
              </div>
            </div>

            {/* In-App Browser Warning Alert (WhatsApp / Instagram / Facebook) */}
            {isInAppBrowser && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Você está navegando pelo aplicativo de redes sociais (WhatsApp/Instagram). Para conseguir fixar o ícone na tela inicial, toque nos <strong>3 pontinhos (⋮)</strong> no canto da tela e selecione <strong>"Abrir no Chrome"</strong> ou <strong>"Abrir no Safari"</strong>.
                </p>
              </div>
            )}

            {/* Device Tabs */}
            <div className="flex rounded-xl bg-slate-950/70 p-1 border border-amber-500/20 mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  resolvedTab === 'android'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  resolvedTab === 'ios'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  resolvedTab === 'desktop'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Computador</span>
              </button>
            </div>

            {/* Content for Android */}
            {resolvedTab === 'android' && (
              <div className="space-y-3 text-xs text-slate-200 bg-[#051A16] p-4 rounded-2xl border border-amber-500/20 leading-relaxed">
                {isInstallable ? (
                  <div className="space-y-2">
                    <p className="text-amber-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Pronto para instalação rápida!
                    </p>
                    <p>
                      Seu dispositivo Android já reconheceu o aplicativo da Rádio Vóz da Fé. Clique no botão abaixo para concluir:
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        const success = await install();
                        if (success) {
                          setInstalledSuccess(true);
                          setShowGuide(false);
                          setTimeout(() => setInstalledSuccess(false), 5000);
                        }
                      }}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Confirmar Instalação no Android</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                        1
                      </span>
                      <p>
                        No <strong>Google Chrome</strong> ou <strong>Samsung Internet</strong>, toque no menu de <strong>3 pontinhos (⋮)</strong> no canto superior ou inferior.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                        2
                      </span>
                      <p>
                        Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                        3
                      </span>
                      <p>
                        Confirme em <strong>"Instalar"</strong>. O ícone da Rádio Vóz da Fé ficará disponível direto na sua tela inicial!
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Content for iOS Safari */}
            {resolvedTab === 'ios' && (
              <div className="space-y-3 text-xs text-slate-200 bg-[#051A16] p-4 rounded-2xl border border-amber-500/20 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                    1
                  </span>
                  <p>
                    Abra o site no <strong>Safari</strong> do iPhone ou iPad.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                    2
                  </span>
                  <p>
                    Toque no botão de <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> (ícone de quadrado com seta para cima na barra inferior).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                    3
                  </span>
                  <p>
                    Role as opções e toque em <PlusSquare className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> <strong>"Adicionar à Tela de Início"</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                    4
                  </span>
                  <p>
                    Toque em <strong>"Adicionar"</strong> no canto superior direito para concluir. Pronto!
                  </p>
                </div>
              </div>
            )}

            {/* Content for Desktop */}
            {resolvedTab === 'desktop' && (
              <div className="space-y-3 text-xs text-slate-200 bg-[#051A16] p-4 rounded-2xl border border-amber-500/20 leading-relaxed">
                {isInstallable ? (
                  <div className="space-y-2">
                    <p className="text-amber-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Pronto para instalar no seu computador!
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        const success = await install();
                        if (success) {
                          setInstalledSuccess(true);
                          setShowGuide(false);
                          setTimeout(() => setInstalledSuccess(false), 5000);
                        }
                      }}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Instalar Rádio Vóz da Fé Agora</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                        1
                      </span>
                      <p>
                        No <strong>Google Chrome</strong> ou <strong>Microsoft Edge</strong>, olhe para o lado direito da barra de endereço onde fica o link.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                        2
                      </span>
                      <p>
                        Clique no ícone de <strong>instalação de aplicativo</strong> (computador com seta para baixo ou símbolo de <strong>+</strong>).
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] flex-shrink-0">
                        3
                      </span>
                      <p>
                        Ou acesse o menu <strong>(⋮) &gt; "Salvar e compartilhar" &gt; "Instalar Rádio Vóz da Fé"</strong>.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 text-slate-200 hover:text-white font-medium py-2.5 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Copiar link da rádio para abrir no Chrome ou Safari"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copiar Link do App</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold px-5 py-2.5 text-xs transition-colors cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
