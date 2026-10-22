import React from 'react';
import { BookOpen, Headphones, Play, Pause, Clock, Calendar, Sparkles } from 'lucide-react';
import { DailyVerseCard } from './DailyVerseCard';
import { useRadio } from '../context/RadioContext';
import { PodcastEpisode } from '../types';

export const DevotionalsSection: React.FC = () => {
  const { isPlaying, activePodcast, playPodcast, stopPodcast, podcasts } = useRadio();

  const handleTogglePodcast = (episode: PodcastEpisode) => {
    if (activePodcast?.id === episode.id && isPlaying) {
      stopPodcast();
    } else {
      playPodcast(episode);
    }
  };

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Top Section: Daily Scripture Devotional Card */}
      <div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Meditação Diária nas Escrituras</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-white">
            Palavra Viva do Dia
          </h2>
        </div>

        <DailyVerseCard />
      </div>

      {/* Bottom Section: Podcasts & Audio Preachings */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
              <Headphones className="w-3.5 h-3.5" />
              <span>Acervo de Áudio & Ministrações</span>
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-white">
              Podcasts & Mensagens de Fé
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Ouça ministrações bíblicas, séries sobre a família e reflexões profundas a qualquer hora do seu dia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((ep) => {
            const isThisPlaying = activePodcast?.id === ep.id && isPlaying;

            return (
              <div
                key={ep.id}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                  isThisPlaying
                    ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="relative h-44 overflow-hidden group">
                    <img
                      src={ep.coverImage}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ep.duration}
                      </span>
                    </div>

                    <button
                      onClick={() => handleTogglePodcast(ep)}
                      className={`absolute bottom-3 right-3 flex items-center justify-center w-12 h-12 rounded-full transition-transform active:scale-95 shadow-lg ${
                        isThisPlaying
                          ? 'bg-amber-500 text-slate-950 shadow-amber-500/40'
                          : 'bg-amber-500/90 hover:bg-amber-400 text-slate-950 hover:scale-105'
                      }`}
                      aria-label="Reproduzir episódio"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ep.date}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-medium">{ep.preacher}</span>
                    </div>

                    <h4 className="font-serif-title text-base font-bold text-white line-clamp-2">
                      {ep.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {ep.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {ep.plays.toLocaleString('pt-BR')} ouvintes
                  </span>

                  <button
                    onClick={() => handleTogglePodcast(ep)}
                    className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {isThisPlaying ? 'Pausar Áudio' : 'Ouvir Agora →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
