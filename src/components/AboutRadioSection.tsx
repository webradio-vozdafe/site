import React from 'react';
import {
  Radio,
  Phone,
  Mail,
  MessageCircle,
  Users
} from 'lucide-react';
import { RADIO_STATION } from '../data/radioData';

export const AboutRadioSection: React.FC = () => {
  const team = [
    {
      name: "Pr. Marcos Lima",
      role: "Diretor Geral & Pastor Presidente",
      bio: "Mais de 25 anos dedicados à proclamação do Evangelho e restauração de famílias através da Palavra.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Missionária Sarah Costa",
      role: "Apresentadora & Intercessão",
      bio: "Voz conhecida pelas manhãs de oração e testemunhos de curas e libertações.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Ev. Gabriel Souza",
      role: "Coordenador de Programação Musical",
      bio: "Especialista em louvor congregacional e hinos que marcaram gerações.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Débora Santos",
      role: "Jornalista & Comunicação",
      bio: "Responsável pelo jornalismo do Reino e reportagens sobre a igreja no Brasil e no mundo.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Station Story Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5" />
            <span>Nossa História & Missão</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-5xl font-extrabold text-white">
            Uma Voz de Esperança para Todas as Gerações
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            A <strong className="text-amber-400">Rádio Vóz da Fé</strong> nasceu no coração de Deus com um propósito inegociável: levar o Evangelho de Jesus Cristo, a música que cura e a oração que conforta para cada rincão do Brasil e aos confins da Terra através da internet.
          </p>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Com sede em São Paulo e transmissão digital em alta definição, alcançamos diariamente milhares de lares, hospitais, veículos e locais de trabalho. Nossa grade é 100% comprometida com a sã doutrina bíblica, respeito à família e amor ao próximo.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-slate-800">
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              {RADIO_STATION.yearsOnAir}
            </span>
            <span className="text-xs text-slate-400 font-medium">No Ar Ininterruptamente</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              24h/7d
            </span>
            <span className="text-xs text-slate-400 font-medium">Programação Ao Vivo</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              100%
            </span>
            <span className="text-xs text-slate-400 font-medium">Mensagem Cristã</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              FM 104.9
            </span>
            <span className="text-xs text-slate-400 font-medium">Sintonize no Rádio</span>
          </div>
        </div>
      </div>

      {/* Team / Locutores */}
      <div>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Equipe de Locutores & Pastores</span>
          </div>
          <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-white">
            Vozes que Pregam a Verdade
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-amber-500/40 transition-all text-center flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/40 mb-4 shadow-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-serif-title text-base font-bold text-white">
                {member.name}
              </h4>
              <p className="text-xs text-amber-400 font-semibold mb-2">
                {member.role}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Studio Contact Cards */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10">
        <h3 className="font-serif-title text-2xl font-bold text-white mb-6">
          Entre em Contato com Nosso Estúdio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">WhatsApp do Ouvinte</h4>
              <p className="text-xs text-slate-400 mt-1">{RADIO_STATION.whatsapp}</p>
              <a
                href={`https://wa.me/5511987654321?text=${encodeURIComponent('Paz do Senhor!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                Enviar mensagem agora →
              </a>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Telefone da Emissora</h4>
              <p className="text-xs text-slate-400 mt-1">{RADIO_STATION.phone}</p>
              <span className="inline-block mt-2 text-[11px] text-slate-500">
                Segunda a Sexta, 8h às 18h
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">E-mail de Contato</h4>
              <p className="text-xs text-slate-400 mt-1">{RADIO_STATION.email}</p>
              <span className="inline-block mt-2 text-[11px] text-slate-500">
                Para testemunhos e parcerias
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
