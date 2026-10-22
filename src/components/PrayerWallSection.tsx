import React, { useState } from 'react';
import {
  HeartHandshake,
  Heart,
  Flame,
  Plus,
  Search,
  Filter,
  MapPin,
  Send,
  X,
  CheckCircle2
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { PrayerRequest } from '../types';

export const PrayerWallSection: React.FC = () => {
  const { prayerRequests, addPrayerRequest, prayForRequest } = useRadio();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // New prayer form fields
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState<PrayerRequest['category']>('Saúde');
  const [content, setContent] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const categories: Array<'Todas' | PrayerRequest['category']> = [
    'Todas',
    'Saúde',
    'Família',
    'Vida Espiritual',
    'Finanças',
    'Causas Urgentes',
    'Gratidão'
  ];

  const filteredRequests = prayerRequests.filter((req) => {
    const matchesCategory = selectedCategory === 'Todas' || req.category === selectedCategory;
    const matchesSearch =
      req.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalIntercessions = prayerRequests.reduce((acc, curr) => acc + curr.prayersCount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    addPrayerRequest({
      authorName: authorName.trim(),
      city: city.trim() || 'Brasil',
      state: state.trim() || 'BR',
      category,
      content: content.trim()
    });

    setFormSuccess(true);
    setTimeout(() => {
      setAuthorName('');
      setCity('');
      setState('');
      setContent('');
      setFormSuccess(false);
      setIsFormOpen(false);
    }, 1500);
  };

  const getCategoryColor = (cat: PrayerRequest['category']) => {
    switch (cat) {
      case 'Saúde':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Família':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Vida Espiritual':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Finanças':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Causas Urgentes':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Gratidão':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Mural de Intercessão Contínua</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-white">
            Mural de Oração
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            "Orai uns pelos outros, para que sejais curados. A oração eficaz do justo é poderosa em seus efeitos." (Tiago 5:16)
          </p>
        </div>

        {/* Counter and CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-amber-500/30 text-center">
            <span className="block text-xl font-bold font-mono text-amber-400">
              {totalIntercessions.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Orações Levantadas
            </span>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Deixar Meu Pedido</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, cidade ou palavra-chave..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Clear */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs self-end sm:self-auto"
            >
              Limpar Busca
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filtrar:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prayer Request Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className={`rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between ${
              req.hasUserPrayed
                ? 'bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              {/* Card Top: Category and timestamp */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryColor(req.category)}`}>
                  {req.category}
                </span>
                <span className="text-[11px] text-slate-500">
                  {req.createdAt}
                </span>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 uppercase">
                  {req.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {req.authorName}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-amber-400/80" />
                    {req.city}, {req.state}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-4">
                "{req.content}"
              </p>
            </div>

            {/* Card Footer: Prayer count and interactive prayer button */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400/20" />
                <span className="font-mono font-bold">{req.prayersCount}</span>
                <span className="text-slate-400 text-[11px]">
                  {req.prayersCount === 1 ? 'irmão orando' : 'irmãos orando'}
                </span>
              </div>

              <button
                onClick={() => prayForRequest(req.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  req.hasUserPrayed
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${req.hasUserPrayed ? 'fill-current text-slate-950' : 'text-amber-400'}`} />
                <span>{req.hasUserPrayed ? 'Oração Feita (Amém!)' : 'Estou Orando'}</span>
              </button>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
            <HeartHandshake className="w-12 h-12 mx-auto text-amber-400/40 mb-3" />
            <h3 className="font-serif-title text-base font-bold text-slate-300">
              Nenhum pedido encontrado nesta categoria
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Seja o primeiro a compartilhar uma intenção de oração ou remover os filtros.
            </p>
          </div>
        )}
      </div>

      {/* New Prayer Request Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-slate-100 relative">
            
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-title text-xl font-bold text-white">
                  Apresentar Pedido ao Altar
                </h3>
                <p className="text-xs text-slate-400">
                  Os locutores e a comunidade estarão em oração por você
                </p>
              </div>
            </div>

            {formSuccess ? (
              <div className="py-10 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-serif-title text-xl font-bold text-white">
                  Pedido Recebido com Sucesso!
                </h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Seu pedido foi colocado diante do altar do Senhor e já está visível para os intercessores.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Seu Nome Completo ou Como Prefere ser Chamado *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Maria das Graças / Irmão Carlos"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      placeholder="Ex: SP"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Intenção / Categoria de Oração *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PrayerRequest['category'])}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Saúde">Saúde e Cura Divina</option>
                    <option value="Família">Família e Casamento</option>
                    <option value="Vida Espiritual">Vida Espiritual e Avivamento</option>
                    <option value="Finanças">Portas de Emprego e Finanças</option>
                    <option value="Causas Urgentes">Causas Urgentes e Judiciais</option>
                    <option value="Gratidão">Testemunho de Gratidão / Bênção Alcançada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descreva seu Pedido ou Testemunho *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Conte resumidamente seu motivo de oração para que os irmãos orem com entendimento..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publicar Pedido de Oração</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
