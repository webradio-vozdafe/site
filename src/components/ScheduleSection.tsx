import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, Check, Radio, Tag } from 'lucide-react';
import { SCHEDULE_PROGRAMS } from '../data/radioData';
import { useRadio } from '../context/RadioContext';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const ScheduleSection: React.FC = () => {
  const { currentShow } = useRadio();
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());

  // Persistent reminders initialized from localStorage
  const [reminders, setReminders] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('vozdafe_schedule_reminders');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync with Firestore if authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.scheduleReminders && typeof data.scheduleReminders === 'object') {
              setReminders((prev) => {
                const merged = { ...prev, ...data.scheduleReminders };
                try {
                  localStorage.setItem('vozdafe_schedule_reminders', JSON.stringify(merged));
                } catch {
                  // ignore
                }
                return merged;
              });
            }
          }
        } catch (err) {
          console.warn('Erro ao sincronizar lembretes do usuário:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const daysOfWeek = [
    { id: 0, label: 'Dom', full: 'Domingo' },
    { id: 1, label: 'Seg', full: 'Segunda-feira' },
    { id: 2, label: 'Ter', full: 'Terça-feira' },
    { id: 3, label: 'Qua', full: 'Quarta-feira' },
    { id: 4, label: 'Qui', full: 'Quinta-feira' },
    { id: 5, label: 'Sex', full: 'Sexta-feira' },
    { id: 6, label: 'Sáb', full: 'Sábado' },
  ];

  const filteredPrograms = SCHEDULE_PROGRAMS.filter(prog => 
    selectedDay === -1 || prog.days.includes(selectedDay)
  );

  const toggleReminder = (id: string, title: string) => {
    setReminders(prev => {
      const next = !prev[id];
      const updated = { ...prev, [id]: next };

      // Save locally
      try {
        localStorage.setItem('vozdafe_schedule_reminders', JSON.stringify(updated));
      } catch (err) {
        console.error('Erro ao salvar lembrete no navegador:', err);
      }

      // Sync with cloud if logged in
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        setDoc(userRef, { scheduleReminders: updated }, { merge: true }).catch(() => {});
      }

      if (next) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Lembrete Rádio Vóz da Fé", {
            body: `Você será lembrado do programa: ${title}`,
          });
        } else if ("Notification" in window && Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
      return updated;
    });
  };

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Grade Completa de Programação</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-4xl font-extrabold text-white">
            Programação Semanal
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Acompanhe nossos programas diários, estudos da Palavra e noites de intercessão. Sintonize e seja edificado em cada horário.
          </p>
        </div>

        {/* Day selector pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {daysOfWeek.map((day) => {
            const isToday = new Date().getDay() === day.id;
            const isSelected = selectedDay === day.id;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{day.label}</span>
                {isToday && (
                  <span className={`block text-[9px] font-bold ${isSelected ? 'text-slate-900' : 'text-amber-400'}`}>
                    Hoje
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((prog) => {
          const isLiveNow = currentShow.id === prog.id && prog.days.includes(new Date().getDay());
          const hasReminder = !!reminders[prog.id];

          return (
            <div
              key={prog.id}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isLiveNow
                  ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Cover & Time Banner */}
                <div className="relative h-44 overflow-hidden group">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-mono font-bold border border-amber-500/30 flex items-center gap-1.5 shadow-md">
                      <Clock className="w-3.5 h-3.5" />
                      {prog.timeSlot}
                    </span>
                  </div>

                  {isLiveNow && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-extrabold tracking-wider shadow-lg animate-pulse">
                      <Radio className="w-3.5 h-3.5" />
                      AO VIVO AGORA
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-serif-title text-lg font-bold text-white line-clamp-1">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-amber-300 font-medium">
                      {prog.host}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-slate-400">{prog.hostRole}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 border border-slate-700/60 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-amber-400/80" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Reminder toggle */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {prog.days.length === 7 ? 'Diariamente' : `${prog.days.length} dias na semana`}
                </span>

                <button
                  onClick={() => toggleReminder(prog.id, prog.title)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    hasReminder
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {hasReminder ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{hasReminder ? 'Lembrete Ativo' : 'Lembrar-me'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
