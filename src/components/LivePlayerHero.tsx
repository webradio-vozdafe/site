import React, { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Settings,
  Share2,
  Moon,
  Clock,
  Sparkles,
  Users,
  AlertCircle,
  RotateCcw,
  Check
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { AudioVisualizer } from './AudioVisualizer';
import { SleepTimerModal } from './SleepTimerModal';
import { STREAM_QUALITIES, RADIO_STATION } from '../data/radioData';

export const LivePlayerHero: React.FC = () => {
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
    currentShow,
    nextShow,
    showProgress,
    currentTrackInfo,
    sleepTimerRemainingSec,
    setActiveTab,
    activePodcast,
    stopPodcast,
    radioData
  } = useRadio();

  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [sleepModalOpen, setSleepModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatRemainingTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-6 lg:px-8">
      {/* Background Spiritual Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/15 via-amber-950/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Top welcome banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{RADIO_STATION.slogan}</span>
            </div>
            <h1 className="font-serif-title text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              RÁDIO VÓZ DA FÉ
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              24 horas transmitindo o louvor que edifica e a Palavra viva que transforma lares e corações.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all shadow-md"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={() => setSleepModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all shadow-md ${
                sleepTimerRemainingSec !== null
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700/80'
              }`}
            >
              <Moon className="w-4 h-4 text-amber-400" />
              <span>
                {sleepTimerRemainingSec !== null
                  ? `Timer: ${formatRemainingTimer(sleepTimerRemainingSec)}`
                  : 'Timer Sono'}
              </span>
            </button>
          </div>
        </div>

        {/* Podcast playback banner if active */}
        {activePodcast && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  Reproduzindo Mensagem Gravada
                </span>
                <p className="text-sm font-bold text-white line-clamp-1">{activePodcast.title}</p>
                <p className="text-xs text-slate-400">{activePodcast.preacher}</p>
              </div>
            </div>
            <button
              onClick={stopPodcast}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-amber-500/30 transition-colors"
            >
              Voltar ao Ao Vivo
            </button>
          </div>
        )}

        {/* Main Radio Studio Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-500/5">
          
          {/* Audio Error Alert if present */}
          {audioError && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between text-xs text-amber-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{audioError}</span>
              </div>
              <button
                onClick={retryPlayback}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tentar</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Show Info & Host Avatar */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 relative">
                  <img
                    src={currentShow.image}
                    alt={currentShow.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>
                {isPlaying && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md animate-pulse">
                    NO AR
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Transmissão Oficial
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {currentShow.timeSlot}
                  </span>
                </div>

                <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-slate-100 line-clamp-1">
                  {currentShow.title}
                </h2>

                <p className="text-xs text-amber-400 font-medium">
                  {currentShow.host} • <span className="text-slate-400">{currentShow.hostRole}</span>
                </p>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                  {currentShow.description}
                </p>

                {/* Progress bar of current show */}
                <div className="pt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Progresso do programa</span>
                    <span className="text-amber-400 font-mono font-medium">{showProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                      style={{ width: `${showProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Giant Play Button & Live Visualizer */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center">
                
                {/* Glowing pulsating outer rings when playing */}
                {isPlaying && (
                  <>
                    <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-amber-500/10 animate-ping pointer-events-none" />
                    <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-amber-500/20 pointer-events-none" />
                  </>
                )}

                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={`group relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full transition-all duration-300 shadow-2xl active:scale-95 ${
                    isPlaying
                      ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 shadow-amber-500/40 ring-4 ring-amber-400/30'
                      : 'bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 text-slate-950 shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105'
                  }`}
                  aria-label={isPlaying ? 'Pausar rádio' : 'Tocar rádio'}
                >
                  {isLoading ? (
                    <div className="w-10 h-10 border-4 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-10 h-10 sm:w-12 sm:h-12 fill-current" />
                  ) : (
                    <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current translate-x-1" />
                  )}
                </button>
              </div>

              {/* Status text */}
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  {isLoading
                    ? 'Conectando à transmissão...'
                    : isPlaying
                    ? 'Sintonizado • Transmitindo em tempo real'
                    : 'Toque no botão para ouvir ao vivo'}
                </span>
              </div>

              {/* Live Audio Visualizer */}
              <div className="w-full max-w-xs">
                <AudioVisualizer isPlaying={isPlaying} barCount={24} heightClass="h-9" />
              </div>
            </div>

            {/* Right: Now Playing Song & Audio Controls */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
              
              {/* Currently Playing Track */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0">
                    {radioData?.capa_musica ? (
                      <img
                        src={radioData.capa_musica}
                        alt="Capa"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/100x100?text=Vóz';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Radio className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Tocando Agora
                    </span>
                    <p className="font-bold text-sm text-white line-clamp-2 mt-0.5">
                      {radioData?.musica_atual || currentTrackInfo.title}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {radioData?.titulo || currentTrackInfo.artist}
                    </p>
                  </div>
                </div>
                
                {radioData?.proxima_musica && (
                  <div className="text-[10px] text-slate-500 italic bg-slate-900/50 p-2 rounded">
                    <span className="font-bold text-slate-400">Próxima:</span> {radioData.proxima_musica}
                  </div>
                )}
              </div>

              {/* Volume Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <button
                      onClick={toggleMute}
                      className="text-slate-400 hover:text-amber-400 transition-colors"
                      title={isMuted ? 'Desmutar' : 'Mutar'}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    Volume
                  </span>
                  <span className="font-mono text-slate-300">
                    {isMuted ? 'Mudo' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Quality Selector & Listeners info */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                {/* Quality Popover */}
                <div className="relative">
                  <button
                    onClick={() => setQualityMenuOpen(!qualityMenuOpen)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentQuality.label.split(' ')[0]}</span>
                  </button>

                  {qualityMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-44 rounded-xl bg-slate-900 border border-amber-500/30 p-1.5 shadow-xl shadow-black z-30 space-y-1 animate-in fade-in">
                      <span className="text-[10px] font-bold text-slate-400 px-2 py-1 block uppercase">
                        Qualidade do Áudio
                      </span>
                      {STREAM_QUALITIES.map((q) => (
                        <button
                          key={q.label}
                          onClick={() => {
                            setQuality(q);
                            setQualityMenuOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            currentQuality.bitrate === q.bitrate
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{q.label}</span>
                          {currentQuality.bitrate === q.bitrate && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{(radioData?.ouvintes_conectados ?? RADIO_STATION.onlineListeners).toLocaleString('pt-BR')} ouvintes</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Interaction Bar at bottom of card */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Next Show preview */}
            <div className="flex items-center gap-2 text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-bold text-amber-400 uppercase">
                A Seguir
              </span>
              <span className="font-semibold text-slate-200">
                {nextShow.title} ({nextShow.timeSlot})
              </span>
              <span className="hidden md:inline text-slate-500">• com {nextShow.host}</span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('oracao');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium transition-colors"
              >
                + Pedir Oração
              </button>

              <button
                onClick={() => {
                  setActiveTab('pedir-hino');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
              >
                Pedir Hino
              </button>
            </div>

          </div>
        </div>
      </div>

      <SleepTimerModal isOpen={sleepModalOpen} onClose={() => setSleepModalOpen(false)} />
    </section>
  );
};
