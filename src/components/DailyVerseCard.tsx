import React, { useState } from 'react';
import { BookOpen, Volume2, Copy, Check, Sparkles, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { DAILY_VERSES } from '../data/radioData';

export const DailyVerseCard: React.FC = () => {
  const [verseIndex, setVerseIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentVerse = DAILY_VERSES[verseIndex];

  const handleCopy = () => {
    const textToCopy = `"${currentVerse.text}" — ${currentVerse.reference} (Rádio Vóz da Fé)`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(`${currentVerse.reference}. ${currentVerse.text}`);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // reverent, calm pace

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative celestial background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Alimento Espiritual Diário
            </span>
            <h3 className="font-serif-title text-lg font-bold text-slate-100">
              Versículo do Dia
            </h3>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVerseIndex((prev) => (prev === 0 ? DAILY_VERSES.length - 1 : prev - 1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Versículo anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 font-mono px-1">
            {verseIndex + 1}/{DAILY_VERSES.length}
          </span>
          <button
            onClick={() => setVerseIndex((prev) => (prev === DAILY_VERSES.length - 1 ? 0 : prev + 1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Próximo versículo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Verse Quote */}
      <div className="relative mb-6">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/20">
          Tema: {currentVerse.theme}
        </span>

        <blockquote className="font-quote text-xl sm:text-2xl text-slate-100 italic leading-relaxed text-amber-50/95">
          "{currentVerse.text}"
        </blockquote>

        <p className="font-serif-title text-base sm:text-lg font-bold text-amber-400 mt-3 text-right">
          — {currentVerse.reference}
        </p>
      </div>

      {/* Pastoral Devotional reflection */}
      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 mb-6 space-y-2">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {currentVerse.devotionalText}
        </p>
        <p className="text-xs text-amber-400/90 italic pt-1 border-t border-slate-800/80">
          {currentVerse.pastorCommentary}
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Read aloud in audio */}
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'Parar Áudio' : 'Ouvir Versículo'}</span>
          </button>

          {/* Copy verse */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
          <span>Compartilhe essa bênção com alguém hoje</span>
        </div>
      </div>
    </div>
  );
};
