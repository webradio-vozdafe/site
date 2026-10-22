import React from 'react';
import { Radio, Heart, MessageCircle, Phone, Mail, Sparkles } from 'lucide-react';
import { RADIO_STATION } from '../data/radioData';
import { useRadio } from '../context/RadioContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useRadio();

  return (
    <footer className="border-t border-slate-900 bg-slate-950/95 text-slate-400 text-xs pb-24 lg:pb-16 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950">
                <Radio className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-serif-title text-xl font-bold text-white tracking-wider">
                VOZ DA FÉ
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {RADIO_STATION.slogan}. Transmissão 24 horas por dia em FM 104.9 e internet mundial.
            </p>
            <p className="text-[11px] text-amber-400/90 font-medium">
              São Paulo / SP • Brasil
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-serif-title text-sm font-bold text-white uppercase tracking-wider mb-3">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setActiveTab('ao-vivo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Rádio Ao Vivo
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('programacao'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Grade de Programação
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('oracao'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Mural de Oração
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('pedir-hino'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Pedir Louvor
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('devocionais'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Devocionais & Podcasts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio & WhatsApp */}
          <div>
            <h4 className="font-serif-title text-sm font-bold text-white uppercase tracking-wider mb-3">
              Fale Conosco
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {RADIO_STATION.whatsapp}</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Estúdio: {RADIO_STATION.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>{RADIO_STATION.email}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Verse Blessing */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Bênção para Você
            </span>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e tenha misericórdia de ti; o Senhor sobre ti levante o seu rosto e te dê a paz."
            </p>
            <p className="text-[10px] text-amber-400 font-mono">
              Números 6:24-26
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Rádio Vóz da Fé (VOZDAFE). Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-red-500 fill-current inline" /> para abençoar vidas
          </p>
        </div>
      </div>
    </footer>
  );
};
