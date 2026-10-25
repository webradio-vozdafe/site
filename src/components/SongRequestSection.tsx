import React, { useState } from 'react';
import {
  Music,
  Send,
  CheckCircle2,
  Disc3,
  Clock,
  Sparkles,
  MessageCircle,
  Radio,
  UserCheck
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export const SongRequestSection: React.FC = () => {
  const { songRequests, addSongRequest } = useRadio();

  const [listenerName, setListenerName] = useState('');
  const [city, setCity] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [dedicationTo, setDedicationTo] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = songTitle.trim();
    const trimmedListener = listenerName.trim();
    if (!trimmedTitle || !trimmedListener) return;

    addSongRequest({
      listenerName: trimmedListener.slice(0, 100),
      city: (city.trim() || 'Brasil').slice(0, 60),
      songTitle: trimmedTitle.slice(0, 80),
      artist: (artist.trim() || 'Cantor Gospel').slice(0, 80),
      dedicationTo: (dedicationTo.trim() || 'Todos os ouvintes').slice(0, 100),
      message: message.trim() ? message.trim().slice(0, 500) : undefined
    });

    setIsSuccess(true);
    setTimeout(() => {
      setSongTitle('');
      setArtist('');
      setDedicationTo('');
      setMessage('');
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
          <Music className="w-3.5 h-3.5" />
          <span>Participe da Programação Musical</span>
        </div>
        <h2 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-white">
          Pedir Hino & Dedicatória
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Peça o seu louvor favorito para tocar durante os programas ao vivo e dedique uma canção especial a amigos, familiares e sua congregação.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Request Form */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Disc3 className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="font-serif-title text-lg font-bold text-white">
                Ficha de Pedido Musical
              </h3>
              <p className="text-xs text-slate-400">
                Enviado diretamente para a mesa de som
              </p>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif-title text-xl font-bold text-white">
                Hino Enviado com Sucesso!
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                O locutor recebeu sua solicitação e em breve seu louvor e dedicatória estarão no ar!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  value={listenerName}
                  onChange={(e) => setListenerName(e.target.value)}
                  placeholder="Ex: Cláudia Ribeiro"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sua Cidade / Estado *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Curitiba/PR"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome do Hino / Música *
                  </label>
                  <input
                    type="text"
                    required
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="Ex: Bondade de Deus"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cantor / Ministério
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Ex: Isaías Saad"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dedicatória ("Dedico este louvor para...") *
                </label>
                <input
                  type="text"
                  required
                  value={dedicationTo}
                  onChange={(e) => setDedicationTo(e.target.value)}
                  placeholder="Ex: Para meu esposo Paulo, filhos e irmãos da igreja"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mensagem para o Locutor Ler no Ar (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Deixe uma palavra de carinho ou felicitações..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido de Hino</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={`https://wa.me/5511987654321?text=${encodeURIComponent('Paz! Gostaria de pedir um louvor na Rádio Vóz da Fé!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ou peça via WhatsApp direto do estúdio</span>
                </a>
              </div>
            </form>
          )}
        </div>

        {/* Right: On-Air Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-serif-title text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Hinos Solicitados Pelos Ouvintes
            </h3>
            <span className="text-xs text-slate-400">
              {songRequests.length} pedidos hoje
            </span>
          </div>

          <div className="space-y-3">
            {songRequests.map((song) => {
              const isNowPlaying = song.status === 'no_ar';
              const isWaiting = song.status === 'na_fila';

              return (
                <div
                  key={song.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isNowPlaying
                      ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isNowPlaying ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600/90 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
                          <Radio className="w-3 h-3" />
                          No Ar Agora
                        </span>
                      ) : isWaiting ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                          Na Fila
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-emerald-400" />
                          Atendido
                        </span>
                      )}

                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {song.requestedAt}
                      </span>
                    </div>

                    <span className="text-xs text-amber-300 font-medium">
                      Pedido por: {song.listenerName} ({song.city})
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Music className="w-4 h-4 text-amber-400" />
                      {song.songTitle}
                      <span className="text-xs text-slate-400 font-normal">
                        — {song.artist}
                      </span>
                    </h4>

                    <p className="text-xs text-slate-300 italic">
                      <span className="font-semibold text-slate-400 not-italic">Dedicatória:</span> {song.dedicationTo}
                    </p>

                    {song.message && (
                      <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mt-2">
                        "{song.message}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
