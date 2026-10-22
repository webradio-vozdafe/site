import React, { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Music,
  Users,
  RefreshCw,
  Clock,
  Sparkles,
  Wifi,
  AlertTriangle,
  Server,
  Disc,
  Info
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';

const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

export const NowPlayingSection: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    audioError,
    retryPlayback,
    radioData,
    isRadioLoading,
    lastRadioUpdate,
    radioError,
    refreshRadioData
  } = useRadio();

  const [imgSrc, setImgSrc] = useState<string>(radioData?.capa_musica || DEFAULT_COVER_IMAGE);
  const [imgHasError, setImgHasError] = useState<boolean>(false);

  // Sync image source only when radioData capa_musica actually changes
  React.useEffect(() => {
    if (radioData?.capa_musica && radioData.capa_musica.trim().length > 0) {
      setImgSrc(radioData.capa_musica);
      setImgHasError(false);
    } else {
      setImgSrc(DEFAULT_COVER_IMAGE);
    }
  }, [radioData?.capa_musica]);

  const isOnline = radioData?.isOnline ?? (radioData?.status === 'Ligado' || radioData?.status === 'NO AR');
  const listenersCount = Number(radioData?.ouvintes_conectados ?? 0);
  const currentSong = radioData?.musica_atual || 'Transmissão Ao Vivo • Louvor & Palavra';
  const stationTitle = radioData?.titulo || 'RÁDIO VÓZ DA FÉ';
  const genre = radioData?.genero || 'Gospel / Louvor & Adoração';
  const nextSong = radioData?.proxima_musica;
  const bitrate = radioData?.plano_bitrate || '128 kbps';
  const serverPort = radioData?.porta || '8000';

  return (
    <section
      id="tocando-agora"
      className="section wrap my-8"
      aria-labelledby="now-playing-title"
    >
      <div className="section-heading flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <span className="section-kicker flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            Transmissão Oficial ao Vivo
          </span>
          <h2 id="now-playing-title" className="text-2xl sm:text-3xl font-serif text-slate-100 font-bold">
            Tocando Agora
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Last sync info */}
          {lastRadioUpdate && (
            <span className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
              <Clock className="w-3 h-3 text-amber-400" />
              Sincronizado às {lastRadioUpdate}
            </span>
          )}

          {/* Refresh button */}
          <button
            onClick={() => refreshRadioData()}
            disabled={isRadioLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Atualizar dados da rádio agora"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRadioLoading ? 'animate-spin' : ''}`} />
            <span>{isRadioLoading ? 'Atualizando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>

      {/* Connection warning if any */}
      {radioError && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{radioError} O player continua ativo com a programação local.</span>
        </div>
      )}

      {/* Main Now Playing Showcase Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#0e2723]/90 to-slate-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left: Album Cover Art with Live Vinyl/Disc Effect */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
            <div className="relative group w-48 h-48 sm:w-60 sm:h-60">
              {/* Disc animation spinning behind when playing */}
              <div
                className={`absolute -right-3 top-3 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-slate-950 border-4 border-amber-500/30 shadow-2xl flex items-center justify-center transition-transform duration-700 pointer-events-none ${
                  isPlaying ? 'translate-x-6 sm:translate-x-8 animate-spin [animation-duration:12s]' : 'translate-x-0'
                }`}
              >
                <div className="w-16 h-16 rounded-full border-2 border-amber-500/40 bg-slate-900 flex items-center justify-center">
                  <Disc className="w-8 h-8 text-amber-400/80" />
                </div>
              </div>

              {/* Cover Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-slate-900">
                <img
                  src={imgHasError ? DEFAULT_COVER_IMAGE : imgSrc}
                  alt={`Capa da música: ${currentSong}`}
                  onError={() => {
                    setImgHasError(true);
                    setImgSrc(DEFAULT_COVER_IMAGE);
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Status Beacon Tag */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur-md ${
                      isOnline
                        ? 'bg-emerald-500/90 text-slate-950 border border-emerald-300/50'
                        : 'bg-rose-600/90 text-white border border-rose-400/50'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isOnline ? 'bg-slate-950 animate-ping' : 'bg-white'
                      }`}
                    />
                    {isOnline ? 'NO AR' : 'AGUARDANDO'}
                  </span>
                </div>

                {/* Genre badge at bottom of cover */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold truncate max-w-full border border-amber-500/30">
                    {genre}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Metadata & Integrated Controls */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-6 text-left">
            
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-extrabold tracking-widest uppercase text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {stationTitle}
                </span>

                <span className="text-slate-600">•</span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-300 text-xs border border-slate-700">
                  <Users className="w-3 h-3 text-amber-400" />
                  <strong>{listenersCount.toLocaleString('pt-BR')}</strong> ouvintes online
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-300 text-xs border border-slate-700">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  {bitrate}
                </span>
              </div>

              {/* Current track title */}
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight line-clamp-2">
                {currentSong}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{stationTitle} • Transmissão Oficial de Louvor & Adoração</span>
              </p>
            </div>

            {/* Next Track Preview (if available in AutoDJ) */}
            {nextSong && nextSong.trim().length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    Próxima música na programação:
                  </span>
                  <p className="text-slate-200 font-semibold line-clamp-1">{nextSong}</p>
                  <span className="text-[10px] text-slate-500 italic block mt-0.5">
                    * Programação automática AutoDJ (sujeita a alteração durante pregações e entradas ao vivo).
                  </span>
                </div>
              </div>
            )}

            {/* Audio Error alert if audio is broken */}
            {audioError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between">
                <span>{audioError}</span>
                <button
                  onClick={retryPlayback}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Reconectar
                </button>
              </div>
            )}

            {/* Player Controls Strip */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              
              {/* Play / Pause button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-4 ring-amber-400/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  }`}
                  aria-label={isPlaying ? 'Pausar rádio' : 'Ouvir ao vivo'}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  )}
                </button>

                <div>
                  <span className="text-xs font-bold text-white block">
                    {isPlaying ? 'Transmitindo Ao Vivo' : 'Rádio em Espera'}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    {isPlaying ? 'Áudio sincronizado em tempo real' : 'Clique no botão para sintonizar'}
                  </span>
                </div>
              </div>

              {/* Volume & Details */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    title={isMuted ? 'Desmutar' : 'Mutar'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 sm:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    aria-label="Volume da rádio"
                  />
                  <span className="text-xs text-slate-400 font-mono w-9 text-right">
                    {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-500 border-l border-slate-800 pl-4">
                  <Server className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Porta: {serverPort}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
