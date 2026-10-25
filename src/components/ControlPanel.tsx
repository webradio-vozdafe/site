import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Music,
  HeartHandshake,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Check,
  Flame,
  Search,
  Download,
  Upload,
  RotateCcw,
  Clock,
  Users,
  MessageCircle,
  Disc3,
  Headphones,
  Mic,
  MicOff,
  Copy,
  FileText,
  Activity,
  Wifi,
  X,
  Send,
  Inbox,
  LogOut,
  User
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { ShowProgram, PrayerRequest, DailyVerse, PodcastEpisode } from '../types';

export const ControlPanel: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    currentQuality,
    currentTrackInfo,
    setCurrentTrackInfo,
    currentShow,
    setCurrentShow,
    prayerRequests,
    addPrayerRequest,
    deletePrayerRequest,
    updatePrayerRequest,
    songRequests,
    addSongRequest,
    updateSongRequestStatus,
    deleteSongRequest,
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    verses,
    activeVerseIdx,
    setActiveVerseIdx,
    addVerse,
    updateVerse,
    deleteVerse,
    contactMessages,
    updateContactMessageStatus,
    deleteContactMessage,
    podcasts,
    addPodcast,
    deletePodcast,
    stationSettings,
    updateStationSettings,
    setIsControlPanelOpen,
    setActiveTab
  } = useRadio();

  // Control panel active tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    'visao-geral' | 'mesa' | 'oracoes' | 'hinos' | 'programacao' | 'versiculos' | 'mensagens' | 'podcasts' | 'configuracoes' | 'auditoria'
  >('visao-geral');

  // Real-time Brasília Clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Studio toast message
  const [panelToast, setPanelToast] = useState<{ message: string; type?: 'success' | 'info' | 'warn' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setPanelToast({ message, type });
    setTimeout(() => setPanelToast(null), 3800);
  };

  // Soundboard active effect state for visual indicator
  const [activeSoundboardEffect, setActiveSoundboardEffect] = useState<string | null>(null);
  const soundboardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Soundboard Web Audio synthesis
  const playSoundEffect = (type: 'vinheta' | 'hora' | 'clamor' | 'gloria' | 'alerta') => {
    setActiveSoundboardEffect(type);
    if (soundboardTimeoutRef.current) clearTimeout(soundboardTimeoutRef.current);
    const durationMs = type === 'hora' ? 2500 : type === 'clamor' ? 2600 : type === 'vinheta' ? 2000 : 1600;
    soundboardTimeoutRef.current = setTimeout(() => {
      setActiveSoundboardEffect(null);
    }, durationMs);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === 'vinheta') {
        const chord = [523.25, 659.25, 783.99, 1046.5];
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0, now + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 1.3);
        });
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance('Rádio Vóz da Fé, a frequência do céu!');
          u.lang = 'pt-BR';
          u.rate = 1.0;
          setTimeout(() => window.speechSynthesis.speak(u), 450);
        }
        showToast('Vinheta Oficial disparada no ar!');
      } else if (type === 'hora') {
        [0, 0.35, 0.7].forEach((t) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(880, now + t);
          gain.gain.setValueAtTime(0.25, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.2);
        });
        const oscEnd = ctx.createOscillator();
        const gainEnd = ctx.createGain();
        oscEnd.frequency.setValueAtTime(1760, now + 1.05);
        gainEnd.gain.setValueAtTime(0.3, now + 1.05);
        gainEnd.gain.exponentialRampToValueAtTime(0.001, now + 1.05 + 0.8);
        oscEnd.connect(gainEnd);
        gainEnd.connect(ctx.destination);
        oscEnd.start(now + 1.05);
        oscEnd.stop(now + 1.05 + 0.85);

        if ('speechSynthesis' in window) {
          const nowHour = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
          const u = new SpeechSynthesisUtterance(`Vóz da Fé informa: agora são ${nowHour}.`);
          u.lang = 'pt-BR';
          u.rate = 1.0;
          setTimeout(() => window.speechSynthesis.speak(u), 1100);
        }
        showToast('Chamada de Hora Certa executada no ar!');
      } else if (type === 'clamor') {
        [261.63, 329.63, 392.0, 493.88, 587.33].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.15);
          gain.gain.setValueAtTime(0, now + i * 0.15);
          gain.gain.linearRampToValueAtTime(0.18, now + i * 0.15 + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 2.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 2.3);
        });
        showToast('Fundo suave de clamor acionado no estúdio.');
      } else if (type === 'gloria') {
        [440, 554.37, 659.25, 880].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.1);
          gain.gain.setValueAtTime(0.2, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 1.0);
        });
        showToast('Glória a Deus & Aleluia!');
      } else if (type === 'alerta') {
        [600, 900].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(f, now + i * 0.15);
          gain.gain.setValueAtTime(0.2, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.2);
        });
        showToast('Campainha do estúdio acionada.');
      }
    } catch {
      showToast('Efeito sonoro acionado no ar.');
    }
  };

  // Studio Mic Toggle
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const toggleStudioMic = () => {
    const next = !isMicActive;
    setIsMicActive(next);
    if (next) {
      playSoundEffect('alerta');
      showToast('MICROFONE DO LOCUTOR ABERTO NO AR!', 'warn');
    } else {
      showToast('Microfone fechado. Transmissão musical restabelecida.');
    }
  };

  // On-Air Track info form state
  const [trackTitle, setTrackTitle] = useState(currentTrackInfo.title);
  const [trackArtist, setTrackArtist] = useState(currentTrackInfo.artist);
  const [trackAlbum, setTrackAlbum] = useState(currentTrackInfo.album);

  const handleSaveTrackInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentTrackInfo({
      title: trackTitle.trim() || 'Louvor Ao Vivo',
      artist: trackArtist.trim() || 'Ministério de Louvor',
      album: trackAlbum.trim() || 'Rádio Vóz da Fé'
    });
    showToast('Metadados da canção atualizados no ar!');
  };

  // Prayer Management state
  const [prayerSearch, setPrayerSearch] = useState('');
  const [prayerCat, setPrayerCat] = useState('Todas');
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isPrayerScriptModalOpen, setIsPrayerScriptModalOpen] = useState(false);
  const [scriptCategoryFilter, setScriptCategoryFilter] = useState('Todas');
  const [editingPrayerId, setEditingPrayerId] = useState<string | null>(null);
  const [prayerAuthor, setPrayerAuthor] = useState('');
  const [prayerCity, setPrayerCity] = useState('');
  const [prayerState, setPrayerState] = useState('');
  const [prayerCategory, setPrayerCategory] = useState<PrayerRequest['category']>('Saúde');
  const [prayerContent, setPrayerContent] = useState('');

  const handleOpenPrayerModal = (req?: PrayerRequest) => {
    if (req) {
      setEditingPrayerId(req.id);
      setPrayerAuthor(req.authorName);
      setPrayerCity(req.city);
      setPrayerState(req.state);
      setPrayerCategory(req.category);
      setPrayerContent(req.content);
    } else {
      setEditingPrayerId(null);
      setPrayerAuthor('');
      setPrayerCity('São Paulo');
      setPrayerState('SP');
      setPrayerCategory('Saúde');
      setPrayerContent('');
    }
    setIsPrayerModalOpen(true);
  };

  const handleSavePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerAuthor.trim() || !prayerContent.trim()) return;

    if (editingPrayerId) {
      updatePrayerRequest(editingPrayerId, {
        authorName: prayerAuthor.trim(),
        city: prayerCity.trim() || 'Brasil',
        state: prayerState.trim() || 'BR',
        category: prayerCategory,
        content: prayerContent.trim()
      });
      showToast('Pedido de oração atualizado!');
    } else {
      addPrayerRequest({
        authorName: prayerAuthor.trim(),
        city: prayerCity.trim() || 'Brasil',
        state: prayerState.trim() || 'BR',
        category: prayerCategory,
        content: prayerContent.trim()
      });
      showToast(`Pedido de ${prayerAuthor} cadastrado no altar!`);
    }
    setIsPrayerModalOpen(false);
  };

  const filteredPrayers = prayerRequests.filter((p) => {
    const matchesCat = prayerCat === 'Todas' || p.category === prayerCat;
    const lower = prayerSearch.toLowerCase();
    const matchesSearch =
      !prayerSearch ||
      p.authorName.toLowerCase().includes(lower) ||
      p.city.toLowerCase().includes(lower) ||
      p.content.toLowerCase().includes(lower);
    return matchesCat && matchesSearch;
  });

  // Song Request management state
  const [songStatusFilter, setSongStatusFilter] = useState<'todos' | 'na_fila' | 'no_ar' | 'atendido'>('todos');
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [manualSongListener, setManualSongListener] = useState('');
  const [manualSongCity, setManualSongCity] = useState('');
  const [manualSongTitle, setManualSongTitle] = useState('');
  const [manualSongArtist, setManualSongArtist] = useState('');
  const [manualSongDedication, setManualSongDedication] = useState('');
  const [manualSongMessage, setManualSongMessage] = useState('');

  const handleSaveSongManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSongListener.trim() || !manualSongTitle.trim()) return;
    addSongRequest({
      listenerName: manualSongListener.trim(),
      city: manualSongCity.trim() || 'São Paulo/SP',
      songTitle: manualSongTitle.trim(),
      artist: manualSongArtist.trim() || 'Cantor Gospel',
      dedicationTo: manualSongDedication.trim() || 'Família da Fé',
      message: manualSongMessage.trim() || undefined
    });
    showToast(`Pedido de "${manualSongTitle}" adicionado à fila!`);
    setIsSongModalOpen(false);
    setManualSongListener('');
    setManualSongCity('');
    setManualSongTitle('');
    setManualSongArtist('');
    setManualSongDedication('');
    setManualSongMessage('');
  };

  const filteredSongs = songRequests.filter((s) => {
    if (songStatusFilter === 'todos') return true;
    return s.status === songStatusFilter;
  });

  // Program Modal state
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [progTitle, setProgTitle] = useState('');
  const [progHost, setProgHost] = useState('');
  const [progRole, setProgRole] = useState('');
  const [progTimeSlot, setProgTimeSlot] = useState('');
  const [progStartHour, setProgStartHour] = useState(8);
  const [progEndHour, setProgEndHour] = useState(10);
  const [progDesc, setProgDesc] = useState('');
  const [progImage, setProgImage] = useState('');
  const [progDays, setProgDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const handleOpenProgramModal = (prog?: ShowProgram) => {
    if (prog) {
      setEditingProgramId(prog.id);
      setProgTitle(prog.title);
      setProgHost(prog.host);
      setProgRole(prog.hostRole);
      setProgTimeSlot(prog.timeSlot);
      setProgStartHour(prog.startHour);
      setProgEndHour(prog.endHour);
      setProgDesc(prog.description);
      setProgImage(prog.image);
      setProgDays(prog.days);
    } else {
      setEditingProgramId(null);
      setProgTitle('');
      setProgHost('');
      setProgRole('Locutor(a) & Ministro');
      setProgTimeSlot('14:00 - 16:00');
      setProgStartHour(14);
      setProgEndHour(16);
      setProgDesc('');
      setProgImage('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80');
      setProgDays([0, 1, 2, 3, 4, 5, 6]);
    }
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle.trim() || !progHost.trim()) return;

    if (editingProgramId) {
      updateProgram(editingProgramId, {
        title: progTitle.trim(),
        host: progHost.trim(),
        hostRole: progRole.trim(),
        timeSlot: progTimeSlot.trim(),
        startHour: progStartHour,
        endHour: progEndHour,
        description: progDesc.trim(),
        image: progImage.trim(),
        days: progDays
      });
      showToast(`Programa "${progTitle}" atualizado na grade!`);
    } else {
      const newProgram: ShowProgram = {
        id: `prog-${Date.now()}`,
        title: progTitle.trim(),
        host: progHost.trim(),
        hostRole: progRole.trim(),
        timeSlot: progTimeSlot.trim(),
        startHour: progStartHour,
        startMinute: 0,
        endHour: progEndHour,
        endMinute: 0,
        description: progDesc.trim(),
        image: progImage.trim(),
        days: progDays,
        tags: ['Gospel', 'Louvor', 'Fé']
      };
      addProgram(newProgram);
      showToast(`Novo programa "${progTitle}" inserido na grade 24h!`);
    }
    setIsProgramModalOpen(false);
  };

  // Verse Modal state
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [editingVerseId, setEditingVerseId] = useState<string | null>(null);
  const [verseRef, setVerseRef] = useState('');
  const [verseText, setVerseText] = useState('');
  const [verseTheme, setVerseTheme] = useState('');
  const [verseDevotional, setVerseDevotional] = useState('');
  const [verseCommentary, setVerseCommentary] = useState('');

  const handleOpenVerseModal = (v?: DailyVerse) => {
    if (v) {
      setEditingVerseId(v.id);
      setVerseRef(v.reference);
      setVerseText(v.text);
      setVerseTheme(v.theme);
      setVerseDevotional(v.devotionalText);
      setVerseCommentary(v.pastorCommentary);
    } else {
      setEditingVerseId(null);
      setVerseRef('');
      setVerseText('');
      setVerseTheme('Fé e Esperança');
      setVerseDevotional('');
      setVerseCommentary('Pr. Marcos Lima: Deus é o nosso refúgio.');
    }
    setIsVerseModalOpen(true);
  };

  const handleSaveVerse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verseRef.trim() || !verseText.trim()) return;

    if (editingVerseId) {
      updateVerse(editingVerseId, {
        reference: verseRef.trim(),
        text: verseText.trim(),
        theme: verseTheme.trim(),
        devotionalText: verseDevotional.trim(),
        pastorCommentary: verseCommentary.trim()
      });
      showToast('Versículo atualizado no acervo!');
    } else {
      const newV: DailyVerse = {
        id: `verse-${Date.now()}`,
        reference: verseRef.trim(),
        book: verseRef.split(' ')[0] || 'Bíblia',
        chapter: 1,
        verse: 1,
        text: verseText.trim(),
        theme: verseTheme.trim(),
        devotionalText: verseDevotional.trim(),
        pastorCommentary: verseCommentary.trim()
      };
      addVerse(newV);
      showToast('Novo versículo adicionado!');
    }
    setIsVerseModalOpen(false);
  };

  // Podcast Modal state
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [podTitle, setPodTitle] = useState('');
  const [podPreacher, setPodPreacher] = useState('');
  const [podDuration, setPodDuration] = useState('20:00');
  const [podDesc, setPodDesc] = useState('');
  const [podUrl, setPodUrl] = useState('');

  const handleSavePodcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podTitle.trim() || !podPreacher.trim()) return;
    const newPod: PodcastEpisode = {
      id: `pod-${Date.now()}`,
      title: podTitle.trim(),
      preacher: podPreacher.trim(),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
      duration: podDuration.trim() || '20:00',
      audioUrl: podUrl.trim() || 'https://ia800301.us.archive.org/15/items/GospelMusicHymnsInstrumental/GospelHymnInstrumental.mp3',
      description: podDesc.trim(),
      coverImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80',
      plays: 1
    };
    addPodcast(newPod);
    showToast(`Ministração "${podTitle}" catalogada com sucesso!`);
    setIsPodcastModalOpen(false);
    setPodTitle('');
    setPodPreacher('');
    setPodDuration('20:00');
    setPodDesc('');
    setPodUrl('');
  };

  // Backup file input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportBackup = () => {
    const backupData = {
      station: stationSettings,
      programs,
      prayers: prayerRequests,
      songs: songRequests,
      verses,
      contacts: contactMessages,
      podcasts,
      exportedAt: new Date().toISOString(),
      version: '1.2'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_radio_vozdafe_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup completo baixado em arquivo JSON!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.programs) localStorage.setItem('vozdafe_programs', JSON.stringify(json.programs));
        if (json.prayers) localStorage.setItem('vozdafe_prayers', JSON.stringify(json.prayers));
        if (json.songs) localStorage.setItem('vozdafe_songs', JSON.stringify(json.songs));
        if (json.verses) localStorage.setItem('vozdafe_verses', JSON.stringify(json.verses));
        if (json.contacts) localStorage.setItem('vozdafe_contacts', JSON.stringify(json.contacts));
        if (json.podcasts) localStorage.setItem('vozdafe_podcasts', JSON.stringify(json.podcasts));
        if (json.station) localStorage.setItem('vozdafe_station', JSON.stringify(json.station));
        showToast('Backup restaurado com sucesso! Recarregando painel...');
        setTimeout(() => window.location.reload(), 1200);
      } catch {
        showToast('Erro ao importar backup: arquivo JSON inválido.', 'warn');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('Atenção: restaurar os dados originais apagará edições personalizadas salvas no navegador. Deseja continuar?')) {
      localStorage.removeItem('vozdafe_programs');
      localStorage.removeItem('vozdafe_prayers');
      localStorage.removeItem('vozdafe_songs');
      localStorage.removeItem('vozdafe_verses');
      localStorage.removeItem('vozdafe_contacts');
      localStorage.removeItem('vozdafe_podcasts');
      localStorage.removeItem('vozdafe_station');
      window.location.reload();
    }
  };

  // Compile prayer script for announcer with category filter
  const scriptPrayers = scriptCategoryFilter === 'Todas'
    ? filteredPrayers
    : filteredPrayers.filter((p) => p.category === scriptCategoryFilter);

  const prayerScriptText = scriptPrayers.length > 0
    ? scriptPrayers
        .map(
          (p, idx) =>
            `${idx + 1}. ${p.authorName} (${p.city}/${p.state}) — Motivo: ${p.category}\n"${p.content}"\n`
        )
        .join('\n')
    : `Nenhum pedido de oração encontrado para a categoria "${scriptCategoryFilter}".`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#091c1a',
        color: '#fffefa',
        fontFamily: 'var(--sans)'
      }}
      className="pb-24 studio-floating-panel"
    >
      {/* Toast Notification */}
      {panelToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 70,
            background: panelToast.type === 'warn' ? '#78350f' : 'var(--paper)',
            color: panelToast.type === 'warn' ? '#fef3c7' : 'var(--forest)',
            border: '1px solid var(--gold)',
            padding: '12px 18px',
            borderRadius: '6px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            fontSize: '12px',
            fontWeight: 700
          }}
          className="animate-in fade-in slide-in-from-top-2"
        >
          {panelToast.message}
        </div>
      )}

      {/* Top Header Console */}
      <header
        style={{
          borderBottom: '1px solid rgba(230, 184, 107, 0.25)',
          background: 'rgba(12, 33, 31, 0.98)',
          padding: '14px 24px'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Studio Title */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--gold)',
                color: '#192c26',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }}
            >
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#fffefa'
                  }}
                >
                  PAINEL DE CONTROLE DO ESTÚDIO
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(230, 184, 107, 0.2)',
                    color: 'var(--gold)',
                    border: '1px solid rgba(230, 184, 107, 0.4)'
                  }}
                >
                  Web Rádio HD
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                Rádio Vóz da Fé • Mesa Digital de Operação & Sistema de Gestão 24h
              </p>
            </div>
          </div>

          {/* Quick Studio Status, Clock & Return Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Real-time Clock */}
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(16, 43, 40, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span className="font-mono tabular-nums text-slate-200">{currentTimeStr}</span>
              <span className="text-[10px] text-slate-400">Brasília</span>
            </div>

            {/* On-Air Status Pill */}
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '99px',
                background: isPlaying ? 'rgba(22, 101, 52, 0.3)' : 'rgba(120, 53, 15, 0.3)',
                border: isPlaying ? '1px solid rgba(74, 222, 128, 0.5)' : '1px solid rgba(245, 158, 11, 0.5)',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span className={`live-dot ${isPlaying ? 'playing' : ''}`} />
              <span style={{ color: isPlaying ? '#4ade80' : 'var(--gold)', fontWeight: 700 }}>
                {isPlaying ? 'TRANSMISSÃO NO AR' : 'TRANSMISSÃO EM ESPERA'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
              <span className="font-mono tabular-nums text-slate-300">
                {stationSettings.onlineListeners.toLocaleString('pt-BR')} ouvintes
              </span>
            </div>

            {/* Exit to Public View & Logout */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsControlPanelOpen(false);
                  setActiveTab('ao-vivo');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.location.hash = '';
                }}
                className="button button-gold cursor-pointer"
                style={{ minHeight: '38px', padding: '0 16px', fontSize: '11px' }}
                title="Voltar ao portal da rádio"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Visão do Ouvinte
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsControlPanelOpen(false);
                  setActiveTab('perfil');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-2 rounded bg-amber-950/70 hover:bg-amber-900 border border-amber-700 text-amber-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                style={{ minHeight: '38px' }}
                title="Acessar página de perfil"
              >
                <User className="w-3.5 h-3.5" />
                <span>Perfil</span>
              </button>
              <button
                onClick={async () => {
                  await signOut(auth);
                  setIsControlPanelOpen(false);
                  setActiveTab('ao-vivo');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.location.hash = '';
                }}
                className="px-3 py-2 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                style={{ minHeight: '38px' }}
                title="Encerrar sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Navigation Tabs */}
      <div
        style={{
          background: 'rgba(16, 43, 40, 0.75)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '8px 24px'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'visao-geral', label: 'Visão Geral & Métricas', icon: BarChart3 },
            { id: 'mesa', label: 'Mesa de Som (Ao Vivo)', icon: Disc3 },
            { id: 'oracoes', label: `Mural de Oração (${prayerRequests.length})`, icon: HeartHandshake },
            { id: 'hinos', label: `Pedidos de Hinos (${songRequests.length})`, icon: Music },
            { id: 'programacao', label: `Grade 24 Horas (${programs.length})`, icon: Calendar },
            { id: 'versiculos', label: `Palavra do Dia (${verses.length})`, icon: BookOpen },
            { id: 'mensagens', label: `Caixa de Entrada (${contactMessages.length})`, icon: Inbox },
            { id: 'podcasts', label: `Pregações & Podcasts (${podcasts.length})`, icon: Headphones },
            { id: 'auditoria', label: 'Logs de Auditoria', icon: Activity },
            { id: 'configuracoes', label: 'Configurações & Backup', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as typeof activeAdminTab)}
                style={{
                  padding: '7px 13px',
                  borderRadius: '5px',
                  background: isSelected ? 'var(--gold)' : 'transparent',
                  color: isSelected ? '#192c26' : 'rgba(255,255,255,0.75)',
                  fontWeight: isSelected ? 800 : 600,
                  border: isSelected ? '1px solid var(--gold)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Link para a página de perfil */}
          <button
            type="button"
            onClick={() => {
              setIsControlPanelOpen(false);
              setActiveTab('perfil');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              padding: '7px 13px',
              borderRadius: '5px',
              background: 'rgba(230, 184, 107, 0.15)',
              color: 'var(--gold)',
              fontWeight: 700,
              border: '1px solid rgba(230, 184, 107, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              marginLeft: 'auto'
            }}
            title="Acessar página de perfil"
          >
            <User className="w-3.5 h-3.5" />
            <span>Meu Perfil</span>
          </button>
        </div>
      </div>

      {/* Studio Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: VISÃO GERAL & MÉTRICAS (EXECUTIVE DASHBOARD) */}
        {activeAdminTab === 'visao-geral' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.25)]">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Ouvintes Simultâneos</span>
                  <Users className="w-4 h-4 text-[var(--gold)]" />
                </div>
                <strong className="text-2xl font-mono tabular-nums text-[var(--gold)] block">
                  {stationSettings.onlineListeners.toLocaleString('pt-BR')}
                </strong>
                <span className="text-[10px] text-emerald-400 block mt-1">+14% no horário nobre</span>
              </div>

              <div className="p-4 rounded-lg bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.25)]">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Orações no Altar</span>
                  <HeartHandshake className="w-4 h-4 text-[var(--gold)]" />
                </div>
                <strong className="text-2xl font-mono tabular-nums text-white block">
                  {prayerRequests.length}
                </strong>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {prayerRequests.reduce((acc, curr) => acc + curr.prayersCount, 0)} clamores intercessórios
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.25)]">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Louvores Solicitados</span>
                  <Music className="w-4 h-4 text-[var(--gold)]" />
                </div>
                <strong className="text-2xl font-mono tabular-nums text-white block">
                  {songRequests.length}
                </strong>
                <span className="text-[10px] text-amber-300 block mt-1">
                  {songRequests.filter((s) => s.status === 'na_fila').length} aguardando atendimento
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.25)]">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Transmissor & SLA</span>
                  <Wifi className="w-4 h-4 text-emerald-400" />
                </div>
                <strong className="text-2xl font-mono tabular-nums text-emerald-400 block">
                  99.98%
                </strong>
                <span className="text-[10px] text-slate-400 block mt-1">Servidor Shoutcast / Icecast Estável</span>
              </div>
            </div>

            {/* Current Broadcast Spotlight */}
            <div
              style={{
                background: 'rgba(12, 33, 31, 0.75)',
                border: '1px solid rgba(230, 184, 107, 0.3)',
                borderRadius: '8px',
                padding: '20px'
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`live-dot ${isPlaying ? 'playing' : ''}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                    No Ar no Momento
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-white m-0">
                  {currentShow.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 mb-2">
                  Apresentação: <strong className="text-white">{currentShow.host}</strong> ({currentShow.hostRole})
                </p>
                <div className="p-3 rounded bg-[rgba(16,43,40,0.6)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Disc3 className="w-4 h-4 text-[var(--gold)] flex-shrink-0 animate-spin" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-white block truncate">{currentTrackInfo.title}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{currentTrackInfo.artist}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveAdminTab('mesa')}
                    className="text-[11px] font-bold text-[var(--gold)] hover:underline whitespace-nowrap ml-2 cursor-pointer"
                  >
                    Abrir Mesa →
                  </button>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.1)] md:pl-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Ações Imediatas do Operador
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded bg-[rgba(16,43,40,0.9)] border border-[rgba(230,184,107,0.3)] hover:border-[var(--gold)] text-slate-200 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{isPlaying ? 'Pausar Áudio' : 'Conectar Transmissão'}</span>
                  </button>
                  <button
                    onClick={() => playSoundEffect('vinheta')}
                    className="p-2.5 rounded bg-[rgba(16,43,40,0.9)] border border-[rgba(230,184,107,0.3)] hover:border-[var(--gold)] text-slate-200 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <Radio className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>Vinheta da Rádio</span>
                  </button>
                  <button
                    onClick={() => playSoundEffect('hora')}
                    className="p-2.5 rounded bg-[rgba(16,43,40,0.9)] border border-[rgba(230,184,107,0.3)] hover:border-[var(--gold)] text-slate-200 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>Hora Certa</span>
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('oracoes')}
                    className="p-2.5 rounded bg-[rgba(16,43,40,0.9)] border border-[rgba(230,184,107,0.3)] hover:border-[var(--gold)] text-slate-200 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                    <span>Ver Clamores</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Audience by Brazilian Region & 24h Hourly Curve */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Hourly curve */}
              <div
                className="lg:col-span-7 rounded-lg p-5 border"
                style={{
                  background: 'rgba(12, 33, 31, 0.7)',
                  borderColor: 'rgba(230, 184, 107, 0.3)'
                }}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(255,255,255,0.08)]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--gold)]" />
                    <h4 className="font-serif text-base font-normal text-white m-0">
                      Curva de Audiência por Faixa Horária
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400">Pico: 08h às 14h</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { slot: '00:00 - 06:00', label: 'Madrugada de Clamor', ouvintes: 1840, pct: 43 },
                    { slot: '06:00 - 09:00', label: 'Amanhecer com Cristo', ouvintes: 4120, pct: 96 },
                    { slot: '09:00 - 12:00', label: 'Voz da Fé no Ar', ouvintes: 4280, pct: 100 },
                    { slot: '12:00 - 14:00', label: 'Conexão Gospel & Notícias', ouvintes: 3890, pct: 91 },
                    { slot: '14:00 - 18:00', label: 'Tarde de Louvor & Adoração', ouvintes: 3450, pct: 81 },
                    { slot: '18:00 - 21:00', label: 'Entardecer com Deus', ouvintes: 3100, pct: 72 },
                    { slot: '21:00 - 00:00', label: 'Noite de Paz & Vigília', ouvintes: 2460, pct: 57 }
                  ].map((row) => (
                    <div key={row.slot} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300 font-semibold">{row.slot} · {row.label}</span>
                        <span className="font-mono tabular-nums text-[var(--gold)] font-bold">
                          {row.ouvintes.toLocaleString('pt-BR')} ouvintes
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-[var(--gold)] rounded-full transition-all duration-500"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div
                className="lg:col-span-5 rounded-lg p-5 border"
                style={{
                  background: 'rgba(12, 33, 31, 0.7)',
                  borderColor: 'rgba(230, 184, 107, 0.3)'
                }}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(255,255,255,0.08)]">
                  <h4 className="font-serif text-base font-normal text-white m-0">
                    Audiência por Estado (Brasil)
                  </h4>
                  <span className="text-[10px] text-[var(--gold)] font-mono">Total 100%</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { uf: 'São Paulo (SP)', pct: 43 },
                    { uf: 'Minas Gerais (MG)', pct: 21 },
                    { uf: 'Rio de Janeiro (RJ)', pct: 14 },
                    { uf: 'Paraná & Sul (PR/SC/RS)', pct: 11 },
                    { uf: 'Bahia & Nordeste (BA/CE/PE)', pct: 8 },
                    { uf: 'Distrito Federal & Centro-Oeste', pct: 3 }
                  ].map((item) => (
                    <div key={item.uf} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-300">
                        <span>{item.uf}</span>
                        <span className="font-mono tabular-nums text-[var(--gold)]">{item.pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-[var(--gold)] rounded-full"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MESA DE SOM (MASTER ON-AIR STUDIO CONSOLE) */}
        {activeAdminTab === 'mesa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left: Now Playing & Audio Console */}
            <div
              className="lg:col-span-7 rounded-lg p-6 border space-y-6"
              style={{
                background: 'rgba(12, 33, 31, 0.7)',
                borderColor: 'rgba(230, 184, 107, 0.3)'
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)]">
                <div className="flex items-center gap-2">
                  <Disc3 className="w-5 h-5 text-[var(--gold)]" />
                  <h2 className="font-serif text-xl font-normal text-white m-0">
                    Mesa de Operação & Transmissão Digital
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[rgba(230,184,107,0.15)] text-[var(--gold)]">
                  {currentQuality.label}
                </span>
              </div>

              {/* Master Audio Console with VU Meter */}
              <div
                style={{
                  background: 'rgba(16, 43, 40, 0.85)',
                  border: '1px solid rgba(230, 184, 107, 0.3)',
                  borderRadius: '6px',
                  padding: '20px'
                }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      disabled={isLoading}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'var(--gold)',
                        color: '#192c26',
                        display: 'grid',
                        placeItems: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(230, 184, 107, 0.3)'
                      }}
                      className="hover:scale-105 active:scale-95 transition-all"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
                    </button>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--gold)] block">
                        Transmissor Master
                      </span>
                      <strong className="text-sm font-serif text-white">
                        {isPlaying ? 'Em Transmissão Contínua' : 'Transmissão Pausada'}
                      </strong>
                    </div>
                  </div>

                  {/* Volume Fader */}
                  <div className="flex items-center gap-3">
                    <button onClick={toggleMute} className="text-slate-300 hover:text-white cursor-pointer">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[var(--gold)]" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      style={{ width: '120px', accentColor: 'var(--gold)' }}
                    />
                    <span className="text-xs font-mono tabular-nums text-slate-300 w-9 text-right">
                      {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                    </span>
                  </div>
                </div>

                {/* Animated VU Meter Bars (Left and Right Channels) */}
                <div className="p-3 rounded bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>VU METER (STEREO L/R)</span>
                    <span className="text-emerald-400 font-bold">{isPlaying ? '-6 dB (NOMINAL)' : 'MUTED'}</span>
                  </div>
                  {/* Channel L */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-400 w-3">L</span>
                    <div className="flex-1 flex gap-1 h-3">
                      {Array.from({ length: 18 }).map((_, i) => {
                        const isLit = isPlaying && i < Math.floor(volume * 16 + (Math.sin(Date.now() / 200 + i) * 2));
                        const isRed = i >= 15;
                        const isYellow = i >= 11 && i < 15;
                        return (
                          <div
                            key={`vu-l-${i}`}
                            className={`flex-1 rounded-xs transition-opacity ${
                              isLit
                                ? isRed
                                  ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                                  : isYellow
                                  ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                                  : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                : 'bg-slate-800/80'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  {/* Channel R */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-400 w-3">R</span>
                    <div className="flex-1 flex gap-1 h-3">
                      {Array.from({ length: 18 }).map((_, i) => {
                        const isLit = isPlaying && i < Math.floor(volume * 15 + (Math.cos(Date.now() / 220 + i) * 2));
                        const isRed = i >= 15;
                        const isYellow = i >= 11 && i < 15;
                        return (
                          <div
                            key={`vu-r-${i}`}
                            className={`flex-1 rounded-xs transition-opacity ${
                              isLit
                                ? isRed
                                  ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                                  : isYellow
                                  ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                                  : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                : 'bg-slate-800/80'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form to update Now Playing */}
              <form onSubmit={handleSaveTrackInfo} className="space-y-4">
                <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider block">
                  Editar Metadados do Louvor Atual (No Ar)
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Título do Louvor / Hino *
                  </label>
                  <input
                    type="text"
                    required
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(16, 43, 40, 0.9)',
                      border: '1px solid rgba(230, 184, 107, 0.3)',
                      borderRadius: '4px',
                      color: '#fffefa',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Cantor / Ministério *
                    </label>
                    <input
                      type="text"
                      required
                      value={trackArtist}
                      onChange={(e) => setTrackArtist(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(16, 43, 40, 0.9)',
                        border: '1px solid rgba(230, 184, 107, 0.3)',
                        borderRadius: '4px',
                        color: '#fffefa',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Álbum / Edição
                    </label>
                    <input
                      type="text"
                      value={trackAlbum}
                      onChange={(e) => setTrackAlbum(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(16, 43, 40, 0.9)',
                        border: '1px solid rgba(230, 184, 107, 0.3)',
                        borderRadius: '4px',
                        color: '#fffefa',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Atualiza imediatamente no cabeçalho e na cena do ouvinte.
                  </span>
                  <button
                    type="submit"
                    className="button button-gold cursor-pointer"
                    style={{ minHeight: '38px', padding: '0 20px', fontSize: '11px' }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Salvar Dados no Ar
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Soundboard & Microfone do Locutor */}
            <div
              className="lg:col-span-5 rounded-lg p-6 border space-y-5"
              style={{
                background: 'rgba(12, 33, 31, 0.7)',
                borderColor: 'rgba(230, 184, 107, 0.3)'
              }}
            >
              {/* Studio Microphone Toggle */}
              <div
                style={{
                  background: isMicActive ? 'rgba(185, 28, 28, 0.25)' : 'rgba(16, 43, 40, 0.9)',
                  border: isMicActive ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(230, 184, 107, 0.3)',
                  borderRadius: '6px',
                  padding: '16px'
                }}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isMicActive ? 'bg-red-500 animate-ping' : 'bg-slate-600'
                      }`}
                    />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {isMicActive ? 'MICROFONE ABERTO NO AR' : 'Microfone do Locutor'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 m-0">
                    {isMicActive ? 'Ouvintes ouvindo a locução ao vivo' : 'Clique para abrir o microfone no ar'}
                  </p>
                </div>

                <button
                  onClick={toggleStudioMic}
                  className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isMicActive
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50'
                      : 'border border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                  }`}
                >
                  {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMicActive ? 'Fechar Mic' : 'Abrir Mic'}</span>
                </button>
              </div>

              {/* Soundboard Buttons */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider block">
                  Soundboard & Vinhetas do Estúdio
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => playSoundEffect('vinheta')}
                    className={`p-3 rounded border text-left cursor-pointer group transition-all ${
                      activeSoundboardEffect === 'vinheta'
                        ? 'bg-[var(--gold)]/20 border-[var(--gold)] shadow-lg shadow-amber-500/20 scale-[1.02]'
                        : 'bg-[rgba(16,43,40,0.85)] border-[rgba(230,184,107,0.3)] hover:border-[var(--gold)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[var(--gold)] font-bold block">VINHETA 01</span>
                      {activeSoundboardEffect === 'vinheta' && (
                        <span className="text-[9px] font-bold text-amber-300 flex items-center gap-1 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          NO AR
                        </span>
                      )}
                    </div>
                    <strong className="text-white block group-hover:text-[var(--gold)] transition-colors">
                      Vóz da Fé Oficial
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => playSoundEffect('hora')}
                    className={`p-3 rounded border text-left cursor-pointer group transition-all ${
                      activeSoundboardEffect === 'hora'
                        ? 'bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-500/20 scale-[1.02]'
                        : 'bg-[rgba(16,43,40,0.85)] border-[rgba(230,184,107,0.3)] hover:border-[var(--gold)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-sky-400 font-bold block">HORA CERTA</span>
                      {activeSoundboardEffect === 'hora' && (
                        <span className="text-[9px] font-bold text-sky-300 flex items-center gap-1 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                          NO AR
                        </span>
                      )}
                    </div>
                    <strong className="text-white block group-hover:text-sky-300 transition-colors">
                      Aviso de Horário
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => playSoundEffect('clamor')}
                    className={`p-3 rounded border text-left cursor-pointer group transition-all ${
                      activeSoundboardEffect === 'clamor'
                        ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-500/20 scale-[1.02]'
                        : 'bg-[rgba(16,43,40,0.85)] border-[rgba(230,184,107,0.3)] hover:border-[var(--gold)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-rose-400 font-bold block">MOMENTO DE ORAÇÃO</span>
                      {activeSoundboardEffect === 'clamor' && (
                        <span className="text-[9px] font-bold text-rose-300 flex items-center gap-1 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                          NO AR
                        </span>
                      )}
                    </div>
                    <strong className="text-white block group-hover:text-rose-300 transition-colors">
                      Fundo de Clamor
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => playSoundEffect('gloria')}
                    className={`p-3 rounded border text-left cursor-pointer group transition-all ${
                      activeSoundboardEffect === 'gloria'
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                        : 'bg-[rgba(16,43,40,0.85)] border-[rgba(230,184,107,0.3)] hover:border-[var(--gold)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-emerald-400 font-bold block">CELEBRAÇÃO</span>
                      {activeSoundboardEffect === 'gloria' && (
                        <span className="text-[9px] font-bold text-emerald-300 flex items-center gap-1 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          NO AR
                        </span>
                      )}
                    </div>
                    <strong className="text-white block group-hover:text-emerald-300 transition-colors">
                      Glória a Deus & Amém
                    </strong>
                  </button>
                </div>
              </div>

              {/* Quick Program Switcher */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-bold text-[var(--gold)] uppercase tracking-wider">
                  Trocar Programa no Ar Imediatamente
                </label>
                <select
                  value={currentShow.id}
                  onChange={(e) => {
                    const found = programs.find((p) => p.id === e.target.value);
                    if (found) {
                      setCurrentShow(found);
                      showToast(`Programa alterado para "${found.title}"!`);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    background: 'rgba(16, 43, 40, 0.9)',
                    border: '1px solid rgba(230, 184, 107, 0.3)',
                    color: '#fffefa',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.timeSlot} — {p.title} ({p.host})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MURAL DE ORAÇÕES (PASTORAL DESK) */}
        {activeAdminTab === 'oracoes' && (
          <div
            className="rounded-lg p-6 border space-y-6 animate-in fade-in duration-200"
            style={{
              background: 'rgba(12, 33, 31, 0.7)',
              borderColor: 'rgba(230, 184, 107, 0.3)'
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white m-0">
                  Gerenciador do Mural de Oração & Intercessão
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0">
                  Total de {prayerRequests.length} intenções apresentadas no altar de oração
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsPrayerScriptModalOpen(true)}
                  className="px-3 py-2 rounded text-xs font-bold border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 cursor-pointer flex items-center gap-1.5"
                  title="Gerar roteiro de clamor para leitura no microfone"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Roteiro do Locutor</span>
                </button>

                <button
                  onClick={() => handleOpenPrayerModal()}
                  className="button button-gold cursor-pointer"
                  style={{ minHeight: '36px', padding: '0 16px', fontSize: '11px' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Cadastrar Pedido
                </button>
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded bg-[rgba(16,43,40,0.8)] border border-[rgba(255,255,255,0.08)]">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, cidade ou motivo..."
                  value={prayerSearch}
                  onChange={(e) => setPrayerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded bg-[rgba(12,33,31,0.9)] border border-[rgba(230,184,107,0.3)] text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Categoria:</span>
                <select
                  value={prayerCat}
                  onChange={(e) => setPrayerCat(e.target.value)}
                  className="px-3 py-1.5 rounded bg-[rgba(12,33,31,0.9)] border border-[rgba(230,184,107,0.3)] text-xs text-white outline-none"
                >
                  {['Todas', 'Saúde', 'Família', 'Vida Espiritual', 'Finanças', 'Causas Urgentes', 'Gratidão'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prayer requests list */}
            <div className="space-y-3">
              {filteredPrayers.map((req) => (
                <div
                  key={req.id}
                  style={{
                    background: 'rgba(16, 43, 40, 0.85)',
                    border: '1px solid rgba(230, 184, 107, 0.25)',
                    borderRadius: '6px',
                    padding: '16px'
                  }}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[rgba(230,184,107,0.15)] text-[var(--gold)]">
                        {req.category}
                      </span>
                      <strong className="text-sm font-serif text-white">
                        {req.authorName} ({req.city}/{req.state})
                      </strong>
                      <span className="text-[10px] text-slate-400">• {req.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 italic m-0">"{req.content}"</p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-[var(--gold)] font-mono">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{req.prayersCount}</span>
                    </div>

                    <button
                      onClick={() => {
                        updatePrayerRequest(req.id, { prayersCount: req.prayersCount + 5 });
                        showToast(`+5 clamores intercessórios adicionados ao pedido de ${req.authorName}!`);
                      }}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 cursor-pointer"
                      title="Reforçar clamor"
                    >
                      +5 Clamores
                    </button>

                    <button
                      onClick={() => handleOpenPrayerModal(req)}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-600 text-slate-300 hover:text-white cursor-pointer"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remover o pedido de oração de ${req.authorName}?`)) {
                          deletePrayerRequest(req.id);
                          showToast('Pedido de oração removido.');
                        }
                      }}
                      className="p-1.5 rounded text-red-400 hover:bg-red-950/40 cursor-pointer"
                      title="Excluir pedido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredPrayers.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Nenhum pedido de oração encontrado com os filtros atuais.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PEDIDOS DE HINOS (LOUVORES SOLICITADOS) */}
        {activeAdminTab === 'hinos' && (
          <div
            className="rounded-lg p-6 border space-y-6 animate-in fade-in duration-200"
            style={{
              background: 'rgba(12, 33, 31, 0.7)',
              borderColor: 'rgba(230, 184, 107, 0.3)'
            }}
          >
            <div className="pb-4 border-b border-[rgba(255,255,255,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white m-0">
                  Fila de Louvores Solicitados pelos Ouvintes
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0">
                  Atenda aos pedidos musicais e envie abraços e dedicatórias no ar
                </p>
              </div>

              <button
                onClick={() => setIsSongModalOpen(true)}
                className="button button-gold cursor-pointer"
                style={{ minHeight: '36px', padding: '0 16px', fontSize: '11px' }}
              >
                <Plus className="w-3.5 h-3.5" />
                Registrar Pedido de Ouvinte
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 text-xs">
              {(['todos', 'na_fila', 'no_ar', 'atendido'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSongStatusFilter(st)}
                  className={`px-3 py-1.5 rounded font-semibold cursor-pointer transition-colors ${
                    songStatusFilter === st
                      ? 'bg-[var(--gold)] text-[#192c26]'
                      : 'bg-[rgba(16,43,40,0.8)] text-slate-300 border border-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  {st === 'todos' ? 'Todos os Pedidos' : st === 'na_fila' ? 'Na Fila' : st === 'no_ar' ? 'No Ar Agora' : 'Atendidos'}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  style={{
                    background: 'rgba(16, 43, 40, 0.85)',
                    border: '1px solid rgba(230, 184, 107, 0.25)',
                    borderRadius: '6px',
                    padding: '16px'
                  }}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          song.status === 'no_ar'
                            ? 'bg-rose-700 text-white animate-pulse'
                            : song.status === 'atendido'
                            ? 'bg-emerald-800 text-emerald-200'
                            : 'bg-[rgba(230,184,107,0.2)] text-[var(--gold)]'
                        }`}
                      >
                        {song.status === 'no_ar' ? 'No Ar Agora' : song.status === 'atendido' ? 'Atendido' : 'Na Fila'}
                      </span>
                      <strong className="text-sm font-serif text-white">
                        {song.songTitle} — {song.artist}
                      </strong>
                    </div>

                    <p className="text-xs text-slate-300 m-0">
                      Ouvinte: <strong>{song.listenerName}</strong> ({song.city}) • Dedicatória: <em>{song.dedicationTo}</em>
                    </p>

                    {song.message && (
                      <p className="text-[11px] text-slate-400 italic m-0 pt-1">
                        Recado no ar: "{song.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        updateSongRequestStatus(song.id, 'no_ar');
                        setCurrentTrackInfo({
                          title: song.songTitle,
                          artist: song.artist,
                          album: `Pedido de ${song.listenerName}`
                        });
                        showToast(`"${song.songTitle}" colocada no ar agora!`);
                      }}
                      className="px-2.5 py-1 rounded text-[11px] font-bold bg-[var(--gold)] text-slate-950 hover:bg-amber-400 cursor-pointer"
                    >
                      Colocar no Ar
                    </button>

        {/* TAB 4: PEDIDOS DE HINOS */}
        {(activeAdminTab as string) === 'hinos' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Pedidos de Hinos</h2>
            </div>
            <div className="grid gap-3">
              {songRequests.map((s) => (
                <div key={s.id} className="p-4 rounded bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.2)] flex items-center justify-between">
                  <div>
                    <strong className="text-white block">{s.songTitle} - {s.artist}</strong>
                    <span className="text-xs text-slate-400">Por: {s.listenerName} ({s.city})</span>
                    {s.message && <p className="text-sm text-slate-200 mt-1 italic">"{s.message}"</p>}
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${s.status === 'na_fila' ? 'bg-amber-900 text-amber-200' : 'bg-emerald-900 text-emerald-200'}`}>{s.status}</span>
                    <button onClick={() => deleteSongRequest(s.id)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GRADE 24 HORAS */}
        {(activeAdminTab as string) === 'programacao' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-bold text-white">Grade 24 Horas</h2>
            <div className="grid gap-3">
              {programs.map((p) => (
                <div key={p.id} className="p-4 rounded bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.2)] flex items-center justify-between">
                  <span className="text-white font-semibold">{p.title} - {p.timeSlot}</span>
                  <button onClick={() => deleteProgram(p.id)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PALAVRA DO DIA */}
        {(activeAdminTab as string) === 'versiculos' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-bold text-white">Palavra do Dia</h2>
            <div className="grid gap-3">
              {verses.map((v) => (
                <div key={v.id} className="p-4 rounded bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.2)]">
                  <strong className="text-white">{v.reference}</strong>
                  <p className="text-sm text-slate-200 mt-1">"{v.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CAIXA DE ENTRADA */}
        {(activeAdminTab as string) === 'mensagens' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-bold text-white">Caixa de Entrada</h2>
            <div className="grid gap-3">
              {contactMessages.map((m) => (
                <div key={m.id} className="p-4 rounded bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.2)]">
                  <strong className="text-white">{m.name} - {m.subject}</strong>
                  <p className="text-sm text-slate-200 mt-1">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: PREGAÇÕES & PODCASTS */}
        {(activeAdminTab as string) === 'podcasts' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Pregações & Podcasts</h2>
              <button onClick={() => setIsPodcastModalOpen(true)} className="button button-gold"><Plus className="w-4 h-4"/> Novo</button>
            </div>
            <div className="grid gap-3">
              {podcasts.map((p) => (
                <div key={p.id} className="p-4 rounded bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.2)] flex items-center justify-between">
                  <span className="text-white">{p.title} - {p.preacher}</span>
                  <button onClick={() => deletePodcast(p.id)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: CONFIGURAÇÕES & BACKUP */}
        {(activeAdminTab as string) === 'configuracoes' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-bold text-white">Configurações</h2>
            <div className="p-6 rounded bg-[rgba(16,43,40,0.8)] border border-[rgba(230,184,107,0.2)] space-y-4">
              <div>
                <label className="block text-slate-300 mb-1">Nome da Rádio</label>
                <input 
                  type="text" 
                  value={stationSettings.name}
                  onChange={(e) => updateStationSettings({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[rgba(12,33,31,0.9)] border border-[rgba(230,184,107,0.3)] text-white"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => showToast('Configurações salvas com sucesso!')} 
                  className="button button-gold"
                >
                  Salvar Alterações
                </button>
                <button onClick={handleExportBackup} className="px-4 py-2 rounded border border-[rgba(230,184,107,0.5)] text-[var(--gold)] cursor-pointer">
                  Exportar Backup JSON
                </button>
              </div>
            </div>
          </div>
        )}

                    <button
                      onClick={() => {
                        updateSongRequestStatus(song.id, 'atendido');
                        showToast('Marcado como atendido.');
                      }}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold border border-emerald-500/50 text-emerald-300 hover:bg-emerald-950/40 cursor-pointer"
                    >
                      Atendido
                    </button>

                    <button
                      onClick={() => {
                        deleteSongRequest(song.id);
                        showToast('Pedido musical removido.');
                      }}
                      className="p-1.5 text-red-400 hover:bg-red-950/40 rounded cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GRADE DE PROGRAMAÇÃO 24 HORAS */}
        {activeAdminTab === 'programacao' && (
          <div
            className="rounded-lg p-6 border space-y-6 animate-in fade-in duration-200"
            style={{
              background: 'rgba(12, 33, 31, 0.7)',
              borderColor: 'rgba(230, 184, 107, 0.3)'
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)]">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white m-0">
                  Gerenciamento da Grade de Programação (24 Horas)
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0">
                  Configure programas, horários, locutores e escalas da emissora
                </p>
              </div>

              <button
                onClick={() => handleOpenProgramModal()}
                className="button button-gold cursor-pointer"
                style={{ minHeight: '36px', padding: '0 16px', fontSize: '11px' }}
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Programa
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'rgba(16, 43, 40, 0.85)',
                    border: '1px solid rgba(230, 184, 107, 0.25)',
                    borderRadius: '6px',
                    padding: '16px'
                  }}
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[var(--gold)]">
                        {p.timeSlot}
                      </span>
                      {currentShow.id === p.id && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-700 text-white font-bold uppercase">
                          No Ar
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-base font-normal text-white m-0 mb-1">
                      {p.title}
                    </h4>

                    <p className="text-xs text-slate-300 m-0 mb-2">
                      {p.host} • <span className="text-slate-400">{p.hostRole}</span>
                    </p>

                    <p className="text-[11px] text-slate-400 leading-relaxed m-0 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentShow(p);
                        showToast(`"${p.title}" colocado no ar agora!`);
                      }}
                      className="text-[11px] text-[var(--gold)] hover:underline cursor-pointer font-bold"
                    >
                      Pôr no Ar Agora
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProgramModal(p)}
                        className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir o programa "${p.title}"?`)) {
                            deleteProgram(p.id);
                            showToast('Programa excluído da grade.');
                          }
                        }}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PALAVRA DO DIA & ACERVO BÍBLICO */}
        {activeAdminTab === 'versiculos' && (
          <div
            className="rounded-lg p-6 border space-y-6 animate-in fade-in duration-200"
            style={{
              background: 'rgba(12, 33, 31, 0.7)',
              borderColor: 'rgba(230, 184, 107, 0.3)'
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)]">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white m-0">
                  Acervo Bíblico & Palavra do Dia
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0">
                  Gerencie as mensagens bíblicas exibidas no Ticker e na seção de Palavra do Dia
                </p>
              </div>

              <button
                onClick={() => handleOpenVerseModal()}
                className="button button-gold cursor-pointer"
                style={{ minHeight: '36px', padding: '0 16px', fontSize: '11px' }}
              >
                <Plus className="w-3.5 h-3.5" />
                Novo Versículo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verses.map((v, idx) => (
                <div
                  key={v.id}
                  style={{
                    background: 'rgba(16, 43, 40, 0.85)',
                    border: activeVerseIdx === idx ? '1px solid var(--gold)' : '1px solid rgba(230, 184, 107, 0.25)',
                    borderRadius: '6px',
                    padding: '16px'
                  }}
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider">
                        Tema: {v.theme}
                      </span>
                      {activeVerseIdx === idx && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--gold)] text-[#192c26] font-bold uppercase">
                          Destaque Atual
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-base font-bold text-white m-0 mb-1">
                      {v.reference}
                    </h4>

                    <p className="text-xs text-slate-200 italic m-0 mb-3 leading-relaxed">
                      "{v.text}"
                    </p>

                    <p className="text-[11px] text-slate-400 m-0 line-clamp-2">
                      {v.devotionalText}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveVerseIdx(idx);
                        showToast(`Versículo "${v.reference}" ativado no topo!`);
                      }}
                      className="text-[11px] text-[var(--gold)] hover:underline cursor-pointer font-bold"
                    >
                      Definir como Destaque
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenVerseModal(v)}
                        className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
                      >
                        Editar
                      </button>
                      {verses.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Excluir o versículo "${v.reference}"?`)) {
                              deleteVerse(v.id);
                              showToast('Versículo excluído.');
                            }
                          }}
                          className="text-red-400 hover:text-red-300 cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CAIXA DE ENTRADA / CONTATO DOS OUVINTES */}
        {activeAdminTab === 'mensagens' && (
          <div
            className="rounded-lg p-6 border space-y-6 animate-in fade-in duration-200"
            style={{
              background: 'rgba(12, 33, 31, 0.7)',
              borderColor: 'rgba(230, 184, 107, 0.3)'
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)]">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white m-0">
                  Caixa de Entrada & Contato dos Ouvintes
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0">
                  Mensagens, testemunhos e sugestões enviadas através do portal da emissora
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--gold)]">
                {contactMessages.length} mensagens arquivadas
              </span>
            </div>

            <div className="space-y-3">
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    background: 'rgba(16, 43, 40, 0.85)',
                    border: '1px solid rgba(230, 184, 107, 0.25)',
                    borderRadius: '6px',
                    padding: '16px'
                  }}
                  className="space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          msg.status === 'nova'
                            ? 'bg-rose-700 text-white'
                            : msg.status === 'respondida'
                            ? 'bg-emerald-800 text-emerald-200'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {msg.status}
                      </span>
                      <strong className="text-sm font-serif text-white">{msg.name}</strong>
                      <span className="text-xs text-slate-400">&lt;{msg.email}&gt;</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Assunto: <strong className="text-[var(--gold)]">{msg.subject}</strong></span>
                      <span>• {msg.sentAt}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-[rgba(12,33,31,0.6)] p-3 rounded border border-[rgba(255,255,255,0.06)] m-0">
                    "{msg.message}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/5511987654321?text=${encodeURIComponent(`Olá ${msg.name}! Aqui é da equipe da Rádio Vóz da Fé a respeito de sua mensagem: "${msg.subject}".`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 flex items-center gap-1 font-semibold"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Responder no WhatsApp
                      </a>

                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(`Resposta Rádio Vóz da Fé - ${msg.subject}`)}`}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Responder E-mail
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {msg.status !== 'respondida' && (
                        <button
                          onClick={() => {
                            updateContactMessageStatus(msg.id, 'respondida');
                            showToast('Mensagem marcada como respondida.');
                          }}
                          className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                        >
                          Marcar como Respondida
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Remover mensagem de ${msg.name}?`)) {
                            deleteContactMessage(msg.id);
                            showToast('Mensagem removida.');
                          }
                        }}
                        className="text-red-400 hover:text-red-300 cursor-pointer p-1"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {contactMessages.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Nenhuma mensagem recebida na caixa de entrada.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: PODCASTS & PREGAÇÕES GRAVADAS */}
        {activeAdminTab === 'podcasts' && (
          <div
            className="rounded-lg p-6 border space-y-6 animate-in fade-in duration-200"
            style={{
              background: 'rgba(12, 33, 31, 0.7)',
              borderColor: 'rgba(230, 184, 107, 0.3)'
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)]">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white m-0">
                  Catálogo de Pregações Gravadas & Podcasts
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0">
                  Gerencie ministrações e mensagens sob demanda para os ouvintes
                </p>
              </div>

              <button
                onClick={() => setIsPodcastModalOpen(true)}
                className="button button-gold cursor-pointer"
                style={{ minHeight: '36px', padding: '0 16px', fontSize: '11px' }}
              >
                <Plus className="w-3.5 h-3.5" />
                Cadastrar Ministração
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {podcasts.map((pod) => (
                <div
                  key={pod.id}
                  style={{
                    background: 'rgba(16, 43, 40, 0.85)',
                    border: '1px solid rgba(230, 184, 107, 0.25)',
                    borderRadius: '6px',
                    padding: '16px'
                  }}
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{pod.date}</span>
                      <span className="font-mono text-[var(--gold)]">{pod.duration}</span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-white mb-1">
                      {pod.title}
                    </h4>

                    <p className="text-xs text-amber-200 mb-2">
                      Ministração: <strong>{pod.preacher}</strong>
                    </p>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed m-0">
                      {pod.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pod.plays} reproduções
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Excluir a ministração "${pod.title}"?`)) {
                          deletePodcast(pod.id);
                          showToast('Ministração removida do catálogo.');
                        }
                      }}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8.5: LOGS DE AUDITORIA */}
        {activeAdminTab === 'auditoria' && (
          <div
            className="rounded-lg p-6 border space-y-6 animate-in fade-in duration-200"
            style={{
              background: 'rgba(12, 33, 31, 0.7)',
              borderColor: 'rgba(230, 184, 107, 0.3)'
            }}
          >
            <div className="pb-4 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white m-0">
                  Logs de Auditoria & Atividade do Sistema
                </h2>
                <p className="text-xs text-slate-400 mt-1 m-0">
                  Registro de segurança, conexões administrativas e alterações recentes na rádio
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--gold)] bg-[rgba(230,184,107,0.1)] px-3 py-1 rounded border border-[var(--gold)]/30">
                Segurança Ativa
              </span>
            </div>

            <div className="space-y-3">
              {[
                { time: 'Hoje, 09:30', action: 'Sincronização de Stream Realizada', user: 'Sistema (Auto)', status: 'Sucesso' },
                { time: 'Hoje, 08:15', action: 'Atualização de Grade de Programação', user: 'vibraefm@gmail.com', status: 'Autorizado' },
                { time: 'Ontem, 22:10', action: 'Moderação de Pedido de Oração', user: 'vibraefm@gmail.com', status: 'Autorizado' },
                { time: 'Ontem, 19:00', action: 'Novo Episódio de Podcast Publicado', user: 'vibraefm@gmail.com', status: 'Sucesso' },
                { time: '20/10/2026, 14:20', action: 'Conexão Admin Autorizada (OAuth)', user: 'vibraefm@gmail.com', status: 'Autenticado' }
              ].map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(16, 43, 40, 0.85)',
                    border: '1px solid rgba(230, 184, 107, 0.2)',
                    borderRadius: '6px',
                    padding: '14px 16px'
                  }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400 text-[11px]">{log.time}</span>
                    <strong className="text-white font-medium">{log.action}</strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300 font-mono text-[11px]">&lt;{log.user}&gt;</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: CONFIGURAÇÕES DA EMISSORA & BACKUP */}
        {activeAdminTab === 'configuracoes' && (
          <div
            className="rounded-lg p-6 border space-y-6 animate-in fade-in duration-200"
            style={{
              background: 'rgba(12, 33, 31, 0.7)',
              borderColor: 'rgba(230, 184, 107, 0.3)'
            }}
          >
            <div className="pb-4 border-b border-[rgba(255,255,255,0.1)]">
              <h2 className="font-serif text-2xl font-normal text-white m-0">
                Configurações da Emissora & Dados do Estúdio
              </h2>
              <p className="text-xs text-slate-400 mt-1 m-0">
                Altere informações oficiais de contato, configure o streaming e exporte backups de segurança
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nome da Rádio
                </label>
                <input
                  type="text"
                  value={stationSettings.name}
                  onChange={(e) => updateStationSettings({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[rgba(16,43,40,0.9)] border border-[rgba(230,184,107,0.3)] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Frequência & Slogan
                </label>
                <input
                  type="text"
                  value={stationSettings.frequency}
                  onChange={(e) => updateStationSettings({ frequency: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[rgba(16,43,40,0.9)] border border-[rgba(230,184,107,0.3)] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  WhatsApp Oficial do Estúdio
                </label>
                <input
                  type="text"
                  value={stationSettings.whatsapp}
                  onChange={(e) => updateStationSettings({ whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[rgba(16,43,40,0.9)] border border-[rgba(230,184,107,0.3)] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  E-mail Oficial
                </label>
                <input
                  type="email"
                  value={stationSettings.email}
                  onChange={(e) => updateStationSettings({ email: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[rgba(16,43,40,0.9)] border border-[rgba(230,184,107,0.3)] text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Backup & Data Synchronization */}
            <div className="pt-6 border-t border-[rgba(255,255,255,0.1)] space-y-4">
              <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider block">
                Backup do Banco de Dados Local & Contingência
              </span>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="button button-gold cursor-pointer"
                    style={{ minHeight: '38px', padding: '0 16px', fontSize: '11px' }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Exportar Backup Completo (JSON)
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded text-xs font-semibold border border-slate-600 text-slate-200 hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[var(--gold)]" />
                    Importar / Restaurar Backup
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </div>

                <button
                  onClick={handleResetDefaults}
                  className="px-3 py-2 rounded text-xs font-semibold border border-red-500/40 text-red-300 hover:bg-red-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar Dados de Fábrica
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Prayer Request (Add/Edit) */}
      {isPrayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'var(--paper)',
              color: 'var(--ink)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              padding: '24px'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-normal text-[var(--forest)] m-0">
                {editingPrayerId ? 'Editar Pedido de Oração' : 'Cadastrar Pedido no Altar'}
              </h3>
              <button onClick={() => setIsPrayerModalOpen(false)} className="text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrayer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#48564e] mb-1">Nome do Solicitante *</label>
                <input
                  type="text"
                  required
                  value={prayerAuthor}
                  onChange={(e) => setPrayerAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Ex: Irmã Maria de Lurdes"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-[#48564e] mb-1">Cidade</label>
                  <input
                    type="text"
                    value={prayerCity}
                    onChange={(e) => setPrayerCity(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">UF</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={prayerState}
                    onChange={(e) => setPrayerState(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="SP"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#48564e] mb-1">Categoria do Pedido *</label>
                <select
                  value={prayerCategory}
                  onChange={(e) => setPrayerCategory(e.target.value as PrayerRequest['category'])}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                >
                  <option value="Saúde">Saúde e Cura Divina</option>
                  <option value="Família">Família e Casamento</option>
                  <option value="Vida Espiritual">Vida Espiritual & Salvação</option>
                  <option value="Finanças">Portas de Emprego & Finanças</option>
                  <option value="Causas Urgentes">Causas Urgentes</option>
                  <option value="Gratidão">Testemunho de Gratidão</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#48564e] mb-1">Motivo / Conteúdo *</label>
                <textarea
                  rows={3}
                  required
                  value={prayerContent}
                  onChange={(e) => setPrayerContent(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Descreva o clamor..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrayerModalOpen(false)}
                  className="px-4 py-2 border border-[#bcc4b9] rounded text-[var(--ink)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button button-gold"
                  style={{ minHeight: '36px', fontSize: '11px', padding: '0 16px' }}
                >
                  Salvar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Script for Announcer */}
      {isPrayerScriptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            style={{
              width: '100%',
              maxWidth: '650px',
              background: 'var(--paper)',
              color: 'var(--ink)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              padding: '24px'
            }}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8b7550]" />
                <h3 className="font-serif text-xl font-normal text-[var(--forest)] m-0">
                  Roteiro de Clamor para o Locutor Ler no Ar
                </h3>
              </div>
              <button onClick={() => setIsPrayerScriptModalOpen(false)} className="text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter for Altar Script */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 p-2.5 rounded bg-[rgba(16,43,40,0.06)] border border-[#dedfd6]">
              <span className="text-xs font-bold text-[#48564e]">
                Filtrar Clamor por Categoria:
              </span>
              <select
                value={scriptCategoryFilter}
                onChange={(e) => setScriptCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded border border-[#dedfd6] bg-white text-xs font-semibold text-[var(--forest)] outline-none cursor-pointer"
              >
                {['Todas', 'Saúde', 'Família', 'Vida Espiritual', 'Finanças', 'Causas Urgentes', 'Gratidão'].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-[var(--muted)] mb-3">
              Lista formatada com {scriptPrayers.length} {scriptCategoryFilter === 'Todas' ? 'pedidos' : `pedidos da categoria "${scriptCategoryFilter}"`} prontos para leitura no microfone durante o momento devocional.
            </p>

            <textarea
              readOnly
              rows={12}
              value={prayerScriptText}
              className="w-full p-3 font-mono text-xs border border-[#dedfd6] rounded bg-[#f7f5ef] text-[var(--ink)] leading-relaxed outline-none"
            />

            <div className="pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Copie e cole no prompter ou leia diretamente na tela.
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(prayerScriptText);
                  showToast('Roteiro copiado para a área de transferência!');
                }}
                className="button button-gold cursor-pointer flex items-center gap-1.5"
                style={{ minHeight: '36px', fontSize: '11px', padding: '0 16px' }}
              >
                <Copy className="w-3.5 h-3.5" />
                Copiar Roteiro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Manual Song Request */}
      {isSongModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              background: 'var(--paper)',
              color: 'var(--ink)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              padding: '24px'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-xl font-normal text-[var(--forest)] m-0">
                Registrar Pedido Musical
              </h3>
              <button onClick={() => setIsSongModalOpen(false)} className="text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSongManual} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Nome do Ouvinte *</label>
                  <input
                    type="text"
                    required
                    value={manualSongListener}
                    onChange={(e) => setManualSongListener(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: João da Silva"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Cidade / UF</label>
                  <input
                    type="text"
                    value={manualSongCity}
                    onChange={(e) => setManualSongCity(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: Osasco/SP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Título do Louvor *</label>
                  <input
                    type="text"
                    required
                    value={manualSongTitle}
                    onChange={(e) => setManualSongTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: Bondade de Deus"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Cantor / Ministério</label>
                  <input
                    type="text"
                    value={manualSongArtist}
                    onChange={(e) => setManualSongArtist(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: Isaías Saad"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#48564e] mb-1">Dedicatória</label>
                <input
                  type="text"
                  value={manualSongDedication}
                  onChange={(e) => setManualSongDedication(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Ex: Minha família"
                />
              </div>

              <div>
                <label className="block font-bold text-[#48564e] mb-1">Recado do Ouvinte</label>
                <textarea
                  rows={2}
                  value={manualSongMessage}
                  onChange={(e) => setManualSongMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Recado para ler no microfone..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSongModalOpen(false)}
                  className="px-4 py-2 border border-[#bcc4b9] rounded text-[var(--ink)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button button-gold"
                  style={{ minHeight: '36px', fontSize: '11px', padding: '0 16px' }}
                >
                  Inserir na Fila
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Program Modal (Add/Edit) */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'var(--paper)',
              color: 'var(--ink)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              padding: '24px'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-normal text-[var(--forest)] m-0">
                {editingProgramId ? 'Editar Programa da Grade' : 'Novo Programa da Grade 24h'}
              </h3>
              <button onClick={() => setIsProgramModalOpen(false)} className="text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#48564e] mb-1">Título do Programa *</label>
                <input
                  type="text"
                  required
                  value={progTitle}
                  onChange={(e) => setProgTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Ex: Manhã de Avivamento"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Locutor / Apresentador *</label>
                  <input
                    type="text"
                    required
                    value={progHost}
                    onChange={(e) => setProgHost(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: Pr. André Carvalho"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Função / Cargo</label>
                  <input
                    type="text"
                    value={progRole}
                    onChange={(e) => setProgRole(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: Pastor e Locutor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Horário (Texto) *</label>
                  <input
                    type="text"
                    required
                    value={progTimeSlot}
                    onChange={(e) => setProgTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="08:00 - 10:00"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Hora Início (0-23)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={progStartHour}
                    onChange={(e) => setProgStartHour(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Hora Fim (0-24)</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={progEndHour}
                    onChange={(e) => setProgEndHour(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#48564e] mb-1">Resumo / Descrição</label>
                <textarea
                  rows={2}
                  value={progDesc}
                  onChange={(e) => setProgDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Resumo do programa..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2 border border-[#bcc4b9] rounded text-[var(--ink)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button button-gold"
                  style={{ minHeight: '36px', fontSize: '11px', padding: '0 16px' }}
                >
                  Salvar Programa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Verse Modal (Add/Edit) */}
      {isVerseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'var(--paper)',
              color: 'var(--ink)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              padding: '24px'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-normal text-[var(--forest)] m-0">
                {editingVerseId ? 'Editar Versículo Bíblico' : 'Novo Versículo do Dia'}
              </h3>
              <button onClick={() => setIsVerseModalOpen(false)} className="text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVerse} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Referência Bíblica *</label>
                  <input
                    type="text"
                    required
                    value={verseRef}
                    onChange={(e) => setVerseRef(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: Salmos 46:1"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Tema Principal *</label>
                  <input
                    type="text"
                    required
                    value={verseTheme}
                    onChange={(e) => setVerseTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: Refúgio e Fortaleza"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#48564e] mb-1">Texto das Escrituras *</label>
                <textarea
                  rows={3}
                  required
                  value={verseText}
                  onChange={(e) => setVerseText(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Deus é o nosso refúgio e fortaleza..."
                />
              </div>

              <div>
                <label className="block font-bold text-[#48564e] mb-1">Reflexão Devocional</label>
                <textarea
                  rows={2}
                  value={verseDevotional}
                  onChange={(e) => setVerseDevotional(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Palavra de fortalecimento..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVerseModalOpen(false)}
                  className="px-4 py-2 border border-[#bcc4b9] rounded text-[var(--ink)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button button-gold"
                  style={{ minHeight: '36px', fontSize: '11px', padding: '0 16px' }}
                >
                  Salvar Versículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Podcast Modal */}
      {isPodcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'var(--paper)',
              color: 'var(--ink)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              padding: '24px'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-normal text-[var(--forest)] m-0">
                Cadastrar Nova Ministração / Podcast
              </h3>
              <button onClick={() => setIsPodcastModalOpen(false)} className="text-slate-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePodcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#48564e] mb-1">Título da Mensagem *</label>
                <input
                  type="text"
                  required
                  value={podTitle}
                  onChange={(e) => setPodTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Ex: O Milagre da Gratidão"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Pregador / Pastor *</label>
                  <input
                    type="text"
                    required
                    value={podPreacher}
                    onChange={(e) => setPodPreacher(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="Ex: Pr. Marcos Lima"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#48564e] mb-1">Duração (Ex: 18:45)</label>
                  <input
                    type="text"
                    value={podDuration}
                    onChange={(e) => setPodDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                    placeholder="18:45"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#48564e] mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={podDesc}
                  onChange={(e) => setPodDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dedfd6] rounded text-[var(--ink)] outline-none"
                  placeholder="Resumo da palavra..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPodcastModalOpen(false)}
                  className="px-4 py-2 border border-[#bcc4b9] rounded text-[var(--ink)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button button-gold"
                  style={{ minHeight: '36px', fontSize: '11px', padding: '0 16px' }}
                >
                  Cadastrar Ministração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
