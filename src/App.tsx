import React, { useState, useEffect } from 'react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { auth } from './lib/firebase';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  MessageCircle,
  Settings,
  Moon,
  RotateCcw,
  AlertCircle,
  Share2,
  Sliders,
  X
} from 'lucide-react';
import { DAILY_VERSES, RADIO_STATION, STREAM_QUALITIES } from './data/radioData';
import { PrayerRequest } from './types';
import { MiniBottomPlayer } from './components/MiniBottomPlayer';
import { SleepTimerModal } from './components/SleepTimerModal';
import { ControlPanel } from './components/ControlPanel';
import { NowPlayingSection } from './components/NowPlayingSection';
import { LoginView } from './components/LoginView';
import { ProfileView } from './components/ProfileView';
import { ScheduleSection } from './components/ScheduleSection';
import { PrayerWallSection } from './components/PrayerWallSection';
import { SongRequestSection } from './components/SongRequestSection';

const MainView: React.FC = () => {
  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE || 'VOZ DA FÉ Web Rádio';
  }, []);

  const {
    isPlaying,
    isLoading,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    currentQuality,
    setQuality,
    audioError,
    retryPlayback,
    currentTrackInfo,
    currentShow,
    sleepTimerRemainingSec,
    addPrayerRequest,
    addContactMessage,
    verses,
    activeVerseIdx,
    setActiveVerseIdx,
    isControlPanelOpen,
    setIsControlPanelOpen,
    activeTab,
    setActiveTab
  } = useRadio();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    return auth.onAuthStateChanged((user) => setIsLoggedIn(!!user));
  }, []);


  const handleOpenStudio = () => {
    if (isLoggedIn) {
      setIsControlPanelOpen(true);
    } else {
      setActiveTab('login');
    }
  };


  // Quality popover & sleep timer modal states
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [sleepModalOpen, setSleepModalOpen] = useState(false);

  // Ticker / Daily verse index
  const currentVerse = verses[activeVerseIdx] || verses[0] || DAILY_VERSES[0];
  const [copiedVerse, setCopiedVerse] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Notice toast state
  const [noticeText, setNoticeText] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNoticeText(msg);
    setTimeout(() => {
      setNoticeText(null);
    }, 4500);
  };

  // Prayer Wall state (Search, Category & Pagination)
  const [prayerModalOpen, setPrayerModalOpen] = useState(false);


  // New prayer form fields
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newCategory, setNewCategory] = useState<PrayerRequest['category']>('Saúde');
  const [newContent, setNewContent] = useState('');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Pedido de oração');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState('');

  // If control panel is open, render ControlPanel view
  if (isControlPanelOpen) {
    return <ControlPanel />;
  }
  
  if (activeTab === 'login') {
    return <LoginView />;
  }

  if (activeTab === 'perfil') {
    return <ProfileView />;
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;

    if (contactSubject === 'Pedido de oração') {
      addPrayerRequest({
        authorName: contactName,
        city: 'Online',
        state: 'BR',
        category: 'Saúde',
        content: contactMessage
      });
      setContactStatus('Seu pedido de oração foi recebido e colocado diante do altar!');
    } else {
      setContactStatus('Mensagem preparada para envio!');
    }

    addContactMessage({
      name: contactName.trim(),
      email: contactEmail.trim() || 'ouvinte@vozdafe.radio.br',
      subject: contactSubject,
      message: contactMessage.trim()
    });

    // Trigger standard mailto protocol
    const subjectLine = `${contactSubject} — VÓZ DA FÉ`;
    const emailBody = `Nome: ${contactName}\nE-mail: ${contactEmail}\nAssunto: ${contactSubject}\n\nMensagem:\n${contactMessage}`;
    window.location.href = `mailto:${RADIO_STATION.email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(emailBody)}`;

    showNotice(`Obrigado, ${contactName}! Mensagem direcionada para o estúdio.`);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactStatus('');
    }, 4500);
  };

  const handleWhatsAppDirect = () => {
    const text = `*Contato Vóz da Fé*\nNome: ${contactName || 'Ouvinte'}\nAssunto: ${contactSubject}\n\nMensagem:\n${contactMessage || 'Paz do Senhor!'}`;
    window.open(`https://wa.me/5511987654321?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    addPrayerRequest({
      authorName: newAuthor.trim(),
      city: newCity.trim() || 'Brasil',
      state: newState.trim() || 'BR',
      category: newCategory,
      content: newContent.trim()
    });

    setPrayerModalOpen(false);
    showNotice(`Pedido de oração de ${newAuthor} apresentado com sucesso!`);
    setNewAuthor('');
    setNewCity('');
    setNewState('');
    setNewContent('');
  };

  const handleCopyVerse = () => {
    navigator.clipboard.writeText(`"${currentVerse.text}" — ${currentVerse.reference}`);
    setCopiedVerse(true);
    showNotice('Versículo copiado para a área de transferência!');
    setTimeout(() => setCopiedVerse(false), 2000);
  };

  const handleSpeakVerse = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`${currentVerse.reference}. ${currentVerse.text}`);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const shareVerseToWhatsApp = () => {
    const text = `“${currentVerse.text}” — ${currentVerse.reference}\n\nOuça a Rádio Vóz da Fé: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    showNotice('Abrindo WhatsApp para compartilhar o versículo...');
  };

  const shareVerseToFacebook = () => {
    const shareUrl = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`“${currentVerse.text}” — ${currentVerse.reference} (Rádio Vóz da Fé)`)}`, '_blank', 'noopener,noreferrer');
    showNotice('Abrindo Facebook para compartilhar...');
  };

  const shareVerseToTwitter = () => {
    const text = `“${currentVerse.text}” — ${currentVerse.reference} | @VozDaFeRadio`;
    const shareUrl = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
    showNotice('Abrindo X (Twitter) para compartilhar...');
  };




  const formatRemainingTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      {/* Top Hero Shell */}
      <div className="hero-shell">
        <header className="header wrap">
          <a className="brand" href="#inicio" aria-label="VÓZ DA FÉ — início">
            <svg className="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M24 15v21M17 22h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M12 15a17 17 0 0 0 0 18M36 15a17 17 0 0 1 0 18M7 10a24 24 0 0 0 0 28M41 10a24 24 0 0 1 0 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".75" />
            </svg>
            <span className="brand-name">VÓZ <span>DA FÉ</span></span>
          </a>

          <nav className="nav" id="site-nav" aria-label="Navegação principal">
            <a href="#tocando-agora">Tocando Agora</a>
            <a href="#programacao">Programação</a>
            <a href="#mensagem">Palavra do dia</a>
            <a href="#oracao">Mural de Oração</a>
            <a href="#contato">Contato</a>
            
            <button
              className="nav-live"
              type="button"
              onClick={() => {
                togglePlay();
                showNotice(isPlaying ? 'Transmissão pausada.' : 'Conectando à transmissão ao vivo da Rádio Vóz da Fé...');
              }}
            >
              <span className={`live-dot ${isPlaying ? 'playing' : ''}`}></span>
              {isPlaying ? 'Pausar rádio' : 'Ouça ao vivo'}
            </button>
          </nav>
        </header>

        <main id="conteudo">
          <section className="hero wrap" id="inicio" aria-labelledby="hero-title">
            <div>
              <span className="eyebrow">Rádio Gospel</span>
              <h1 id="hero-title">Uma voz que<br />renova a sua <em>fé.</em></h1>
              <p className="hero-copy">
                Música, esperança e a Palavra de Deus com você em todos os momentos. Sintonize o que faz bem para a alma.
              </p>

              <div className="hero-actions">
                <button
                  className="button button-gold"
                  type="button"
                  onClick={() => {
                    togglePlay();
                    showNotice(isPlaying ? 'Transmissão pausada.' : 'Sintonizando louvores ao vivo...');
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-3 bg-slate-950 border-r-2 border-l-2 border-transparent" />
                      Pausar a rádio
                    </span>
                  ) : (
                    <>
                      <svg width="13" height="15" viewBox="0 0 14 16" fill="none" aria-hidden="true">
                        <path d="M13 7.13a1 1 0 0 1 0 1.74L2.5 14.93A1 1 0 0 1 1 14.06V1.94a1 1 0 0 1 1.5-.87L13 7.13Z" fill="currentColor" />
                      </svg>
                      Ouvir a rádio
                    </>
                  )}
                </button>

                <a className="text-link" href="#programacao">
                  Conheça a programação <span aria-hidden="true">→</span>
                </a>

                {/* Studio Control Panel Trigger */}
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleOpenStudio}
                    className="text-link cursor-pointer"
                    style={{ background: 'transparent', border: 'none', color: 'var(--gold)' }}
                    title="Acessar Mesa do Estúdio / Painel de Controle"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Painel do Estúdio</span>
                  </button>
                )}

              </div>

              {/* Audio Error Alert if connection drops */}
              {audioError && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '10px 14px',
                    borderRadius: '5px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: '440px'
                  }}
                  className="animate-in fade-in"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-400" />
                    <span>{audioError}</span>
                  </div>
                  <button
                    onClick={retryPlayback}
                    className="flex items-center gap-1 font-bold text-white underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reconectar
                  </button>
                </div>
              )}

              {/* Integrated Audio Control Bar when Playing (or ready) */}
              <div
                style={{
                  marginTop: '18px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: 'rgba(16, 43, 40, 0.65)',
                  border: '1px solid rgba(230, 184, 107, 0.25)',
                  maxWidth: '440px'
                }}
                className="flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                {/* Station Info & Track */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`live-dot ${isPlaying ? 'playing' : ''}`} />
                  <span className="font-semibold text-amber-300 text-[11px]">ÁUDIO HD</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-200 truncate max-w-[140px] text-[11px]">
                    {isPlaying ? currentTrackInfo.title : 'Emissora Ao Vivo'}
                  </span>
                </div>

                {/* Secondary Controls: Volume, Quality & Sleep Timer */}
                <div className="flex items-center gap-2 relative">
                  {/* Volume */}
                  <button
                    onClick={toggleMute}
                    className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                    title={isMuted ? 'Desmutar' : 'Mutar'}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-14 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                  />

                  {/* Quality Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setQualityMenuOpen(!qualityMenuOpen)}
                      className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
                      title="Qualidade do Áudio"
                    >
                      <Settings className="w-3.5 h-3.5 text-[var(--gold)]" />
                    </button>

                    {qualityMenuOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          right: 0,
                          marginBottom: '8px',
                          width: '150px',
                          borderRadius: '6px',
                          background: 'rgba(16, 43, 40, 0.98)',
                          border: '1px solid rgba(230, 184, 107, 0.35)',
                          padding: '6px',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                          zIndex: 30
                        }}
                        className="animate-in fade-in"
                      >
                        <span className="text-[9px] font-bold text-slate-400 px-2 py-0.5 block uppercase tracking-wider">
                          Qualidade Áudio
                        </span>
                        {STREAM_QUALITIES.map((q) => (
                          <button
                            key={q.bitrate}
                            onClick={() => {
                              setQuality(q);
                              setQualityMenuOpen(false);
                              showNotice(`Qualidade alterada para: ${q.label}`);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center justify-between cursor-pointer ${
                              currentQuality.bitrate === q.bitrate
                                ? 'bg-[var(--gold)] text-[#192c26] font-bold'
                                : 'text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <span>{q.label}</span>
                            {currentQuality.bitrate === q.bitrate && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sleep Timer Trigger */}
                  <button
                    onClick={() => setSleepModalOpen(true)}
                    className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
                    title={
                      sleepTimerRemainingSec !== null
                        ? `Desligamento em ${formatRemainingTimer(sleepTimerRemainingSec)}`
                        : 'Programar desligamento'
                    }
                  >
                    <Moon
                      className={`w-3.5 h-3.5 ${
                        sleepTimerRemainingSec !== null ? 'text-amber-300 fill-amber-300' : 'text-[var(--gold)]'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <p className="hero-note">Uma companhia de fé, para onde você for.</p>
            </div>

            <div className="radio-scene" aria-hidden="true">
              <div className="sun"></div>
              <div className="orbit">
                <div className="cross"></div>
              </div>
              <div className={`signal ${isPlaying ? 'playing' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 9a10 10 0 0 1 14 0M8 12a6 6 0 0 1 8 0m-5 3a2 2 0 0 1 2 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <circle cx="12" cy="18" r="1" fill="currentColor" />
                </svg>
              </div>
              <div className="radio-caption">
                <small>{isPlaying ? 'No Ar Agora • Ao Vivo' : 'Em cada canção, uma mensagem'}</small>
                <strong>{isPlaying ? `${currentShow.title}` : 'Fé que toca o coração'}</strong>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Ticker Section: Versículo do Dia */}
      <section className="ticker" aria-label="Versículo do dia">
        <div className="ticker-inner wrap">
          <div className="ticker-label">
            <span className="ticker-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v14M5.5 7.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3.5 5.5a9 9 0 0 0 0 9M16.5 5.5a9 9 0 0 1 0 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <small>Uma palavra para hoje</small>
              <strong>{currentVerse.theme}</strong>
            </span>
          </div>

          <div className="ticker-verse flex items-center justify-end gap-3">
            <span>
              “{currentVerse.text}” <span>{currentVerse.reference}</span>
            </span>
            <button
              onClick={() => setActiveVerseIdx((activeVerseIdx + 1) % DAILY_VERSES.length)}
              className="text-[10px] text-[#8c7653] hover:text-[#102b28] uppercase font-bold tracking-wider underline cursor-pointer ml-2"
              title="Próxima palavra bíblica"
            >
              Mudar
            </button>
          </div>
        </div>
      </section>
 
      {/* Seção Oficial da API: Tocando Agora */}
      <NowPlayingSection />

      {/* Programação Section */}
      <ScheduleSection />

      {/* Mensagem / Palavra do Dia Card */}
      <section className="message-section wrap" id="mensagem" aria-labelledby="message-title">
        <div className="message-card">
          <span className="section-kicker" id="message-title">Guarde no coração</span>
          <blockquote>“{currentVerse.text}”</blockquote>
          <cite>{currentVerse.reference}</cite>

          {/* Action pills in footer of quote */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 relative z-10 text-xs">
            <button
              onClick={handleSpeakVerse}
              className="px-4 py-2 rounded border border-[rgba(230,184,107,.5)] bg-[rgba(16,43,40,.6)] hover:bg-[rgba(16,43,40,.9)] text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{isSpeaking ? 'Parar leitura' : 'Ouvir mensagem'}</span>
            </button>

            <button
              onClick={handleCopyVerse}
              className="px-4 py-2 rounded border border-[rgba(230,184,107,.5)] bg-[rgba(16,43,40,.6)] hover:bg-[rgba(16,43,40,.9)] text-white transition-all cursor-pointer flex items-center gap-2"
            >
              {copiedVerse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--gold)]" />}
              <span>{copiedVerse ? 'Copiado!' : 'Copiar versículo'}</span>
            </button>

            <button
              onClick={() => setActiveVerseIdx((activeVerseIdx + 1) % DAILY_VERSES.length)}
              className="px-4 py-2 rounded border border-[rgba(255,255,255,.2)] bg-[rgba(16,43,40,.4)] hover:bg-[rgba(16,43,40,.7)] text-slate-300 transition-all cursor-pointer"
            >
              Outro versículo →
            </button>
          </div>

          {/* Social Media Share Buttons */}
          <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.12)] flex flex-wrap items-center justify-center gap-3 relative z-10 text-xs">
            <span className="text-[10px] text-[var(--gold)] tracking-widest font-bold uppercase flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Compartilhar no:
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={shareVerseToWhatsApp}
                className="px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:scale-105 active:scale-95 shadow-sm"
                title="Compartilhar versículo no WhatsApp"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
                <span>WhatsApp</span>
              </button>

              {/* Facebook Share Button */}
              <button
                type="button"
                onClick={shareVerseToFacebook}
                className="px-3 py-1.5 rounded-full border border-sky-500/40 bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:scale-105 active:scale-95 shadow-sm"
                title="Compartilhar versículo no Facebook"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span>Facebook</span>
              </button>

              {/* Twitter / X Share Button */}
              <button
                type="button"
                onClick={shareVerseToTwitter}
                className="px-3 py-1.5 rounded-full border border-slate-400/40 bg-slate-900/80 hover:bg-slate-800 text-slate-100 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:scale-105 active:scale-95 shadow-sm"
                title="Compartilhar versículo no Twitter / X"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-slate-200">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mural de Oração & Intercessão */}
      <PrayerWallSection />

      {/* Contato Section (mailto: & WhatsApp direct) */}
      <section className="contact-section wrap" id="contato" aria-labelledby="contact-title">
        <div className="contact-layout">
          <div className="contact-copy">
            <span className="section-kicker">Estamos aqui por você</span>
            <h2 id="contact-title">Sua mensagem faz diferença.</h2>
            <p>
              Tem um pedido de oração, um testemunho ou quer falar com a equipe da rádio? Escreva para nós. Será uma alegria receber sua mensagem.
            </p>
            <div className="contact-reasons">
              <div className="contact-reason">
                <span className="contact-reason-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s-8-4.35-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.65-8 11-8 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </span>
                Pedidos de oração e palavras de apoio
              </div>
              <div className="contact-reason">
                <span className="contact-reason-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M8 7h8m-8 3h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                Testemunhos, sugestões e recados
              </div>
              <div className="contact-reason">
                <span className="contact-reason-icon" aria-hidden="true">
                  <MessageCircle className="w-4 h-4 text-[#8b7550]" />
                </span>
                WhatsApp do Estúdio: {RADIO_STATION.whatsapp}
              </div>
            </div>
          </div>

          <form className="contact-form" id="contact-form" onSubmit={handleContactSubmit}>
            <h3>Fale com a gente</h3>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="contact-name">Seu nome</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Como podemos chamar você?"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">Seu e-mail</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="contact-subject">Assunto</label>
              <select
                id="contact-subject"
                name="subject"
                required
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
              >
                <option value="Pedido de oração">Pedido de oração</option>
                <option value="Testemunho">Testemunho</option>
                <option value="Mensagem para a rádio">Mensagem para a rádio</option>
                <option value="Sugestão">Sugestão</option>
                <option value="Outro assunto">Outro assunto</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">Sua mensagem</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Escreva sua mensagem aqui..."
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="contact-form-footer">
              <p className="form-note">
                Sua mensagem abre pronta no seu aplicativo de e-mail e é enviada diretamente ao estúdio.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="button button-outline cursor-pointer"
                  style={{ minHeight: '44px', fontSize: '11px', padding: '0 14px' }}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  WhatsApp
                </button>
                <button className="button button-outline" type="submit">
                  Preparar mensagem <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            {contactStatus && (
              <p className="contact-status" id="contact-status" role="status" aria-live="polite">
                {contactStatus}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="ao-vivo">
        <div className="footer-main wrap">
          <a className="brand footer-brand" href="#inicio">
            <svg className="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M24 15v21M17 22h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M12 15a17 17 0 0 0 0 18M36 15a17 17 0 0 1 0 18M7 10a24 24 0 0 0 0 28M41 10a24 24 0 0 1 0 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".75" />
            </svg>
            <span className="brand-name">VÓZ <span>DA FÉ</span></span>
          </a>
          <div className="footer-note">
            Uma voz de esperança.<br />Uma companhia de fé.
          </div>
        </div>
        <div className="footer-bottom wrap">
          <span>© {new Date().getFullYear()} VÓZ DA FÉ. Feita com fé e carinho.</span>
          <div className="social-links">
            <a href="#contato">Contato</a>
            <a href="#programacao">Programação</a>
            <a href="#oracao">Oração</a>
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleOpenStudio}
                className="cursor-pointer text-inherit hover:text-[var(--gold)] transition-colors bg-transparent border-0 font-inherit p-0"
                title="Acessar o Painel de Controle da Emissora"
              >
                Painel de Controle
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Sticky Mini Bottom Player when scrolling */}
      <MiniBottomPlayer />

      {/* Floating Studio Trigger Button */}
      {isLoggedIn && (
        <button
          type="button"
          onClick={handleOpenStudio}
          className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border border-amber-500/50 bg-[#0c211f]/95 text-amber-300 hover:text-white hover:bg-[#102b28] shadow-xl backdrop-blur-md text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="Acessar Mesa do Estúdio / Painel de Controle"
        >
          <Sliders className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span>Painel do Estúdio</span>
        </button>
      )}

      {/* Floating Notice Toast */}
      <div className={`notice ${noticeText ? 'show' : ''}`} id="notice" role="status" aria-live="polite">
        {noticeText}
      </div>

      {/* Modal: Sleep Timer */}
      <SleepTimerModal isOpen={sleepModalOpen} onClose={() => setSleepModalOpen(false)} />

      {/* Modal: Novo Pedido de Oração */}
      {prayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-lg bg-[var(--paper)] border border-[var(--line)] p-6 shadow-2xl relative">
            <button
              onClick={() => setPrayerModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7550]">
              Altar da Fé
            </span>
            <h3 className="font-serif text-2xl font-normal text-[var(--forest)] mb-1">
              Deixar Pedido de Oração
            </h3>
            <p className="text-xs text-[var(--muted)] mb-5">
              Nossa equipe pastoral colocará sua intenção nas vigílias e manhãs de clamor.
            </p>

            <form onSubmit={handlePrayerSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#48564e] mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Como podemos chamar você?"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-xs text-[var(--ink)] focus:outline-none focus:border-[#8b9a7e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#48564e] mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-xs text-[var(--ink)] focus:outline-none focus:border-[#8b9a7e]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#48564e] mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="Ex: SP"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-xs text-[var(--ink)] focus:outline-none focus:border-[#8b9a7e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#48564e] mb-1">
                  Intenção de Oração *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as PrayerRequest['category'])}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-xs text-[var(--ink)] focus:outline-none focus:border-[#8b9a7e]"
                >
                  <option value="Saúde">Saúde e Cura</option>
                  <option value="Família">Família e Casamento</option>
                  <option value="Vida Espiritual">Vida Espiritual</option>
                  <option value="Finanças">Portas de Emprego & Finanças</option>
                  <option value="Causas Urgentes">Causas Urgentes</option>
                  <option value="Gratidão">Testemunho de Gratidão</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#48564e] mb-1">
                  Seu Pedido *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Escreva brevemente seu pedido para que oremos com entendimento..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-xs text-[var(--ink)] focus:outline-none focus:border-[#8b9a7e]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPrayerModalOpen(false)}
                  className="px-4 py-2 border border-[#bcc4b9] rounded text-xs text-[var(--ink)] hover:bg-[var(--cream)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button button-gold"
                  style={{ minHeight: '38px', padding: '0 16px', fontSize: '11px' }}
                >
                  Apresentar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Song Request Section */}
      <SongRequestSection />
    </>
  );
};

export function App() {
  return (
    <RadioProvider>
      <MainView />
    </RadioProvider>
  );
}

export default App;
