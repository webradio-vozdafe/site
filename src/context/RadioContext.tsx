import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ShowProgram,
  PrayerRequest,
  SongRequest,
  StreamQuality,
  PodcastEpisode,
  DailyVerse,
  ContactMessage,
  RadioAPIData
} from '../types';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query } from 'firebase/firestore';
import {
  STREAM_QUALITIES,
  getCurrentShow,
  getNextShow,
  SCHEDULE_PROGRAMS,
  DAILY_VERSES,
  RADIO_STATION,
  INITIAL_PRAYER_REQUESTS,
  INITIAL_SONG_REQUESTS,
  INITIAL_CONTACT_MESSAGES,
  PODCAST_EPISODES
} from '../data/radioData';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface RadioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  currentQuality: StreamQuality;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setQuality: (quality: StreamQuality) => void;
  audioError: string | null;
  retryPlayback: () => void;

  // Track & Show
  currentShow: ShowProgram;
  setCurrentShow: (show: ShowProgram) => void;
  nextShow: ShowProgram;
  showProgress: number;
  currentTrackInfo: { title: string; artist: string; album: string };
  setCurrentTrackInfo: (info: { title: string; artist: string; album: string }) => void;

  // Sleep Timer
  sleepTimerMinutes: number | null;
  sleepTimerRemainingSec: number | null;
  setSleepTimer: (minutes: number | null) => void;

  // Prayer Wall
  prayerRequests: PrayerRequest[];
  addPrayerRequest: (data: { authorName: string; city: string; state: string; category: PrayerRequest['category']; content: string }) => void;
  prayForRequest: (id: string) => void;
  deletePrayerRequest: (id: string) => void;
  updatePrayerRequest: (id: string, updates: Partial<PrayerRequest>) => void;

  // Song Requests
  songRequests: SongRequest[];
  addSongRequest: (data: { listenerName: string; city: string; songTitle: string; artist: string; dedicationTo: string; message?: string }) => void;
  updateSongRequestStatus: (id: string, status: SongRequest['status']) => void;
  deleteSongRequest: (id: string) => void;

  // Schedule Management
  programs: ShowProgram[];
  addProgram: (prog: ShowProgram) => void;
  updateProgram: (id: string, updates: Partial<ShowProgram>) => void;
  deleteProgram: (id: string) => void;

  // Verses Management
  verses: DailyVerse[];
  activeVerseIdx: number;
  setActiveVerseIdx: (idx: number) => void;
  addVerse: (verse: DailyVerse) => void;
  updateVerse: (id: string, updates: Partial<DailyVerse>) => void;
  deleteVerse: (id: string) => void;

  // Station Settings
  stationSettings: typeof RADIO_STATION;
  updateStationSettings: (updates: Partial<typeof RADIO_STATION>) => void;

  // Contact Messages
  contactMessages: ContactMessage[];
  addContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => void;
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteContactMessage: (id: string) => void;

  // Podcasts
  podcasts: PodcastEpisode[];
  addPodcast: (podcast: PodcastEpisode) => void;
  deletePodcast: (id: string) => void;

  // Navigation & Control Panel
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isControlPanelOpen: boolean;
  setIsControlPanelOpen: (open: boolean) => void;

  // Podcast / Sermon playback
  activePodcast: PodcastEpisode | null;
  playPodcast: (podcast: PodcastEpisode) => void;
  stopPodcast: () => void;
  
  // Live Radio API Data
  radioData: RadioAPIData | null;
  isRadioLoading: boolean;
  lastRadioUpdate: string | null;
  radioError: string | null;
  refreshRadioData: () => Promise<void>;
  effectiveStreamUrl: string;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const v = localStorage.getItem('vozdafe_volume');
      return v ? parseFloat(v) : 0.85;
    } catch {
      return 0.85;
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vozdafe_muted') === 'true';
    } catch {
      return false;
    }
  });
  const [currentQuality, setCurrentQuality] = useState<StreamQuality>(STREAM_QUALITIES[0]);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Active Podcast mode vs live stream
  const [activePodcast, setActivePodcast] = useState<PodcastEpisode | null>(null);

  // Audio HTML Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Programs state with localStorage
  const [programs, setPrograms] = useState<ShowProgram[]>(() => {
    try {
      const saved = localStorage.getItem('vozdafe_programs');
      return saved ? JSON.parse(saved) : SCHEDULE_PROGRAMS;
    } catch {
      return SCHEDULE_PROGRAMS;
    }
  });

  // Current Show
  const [currentShow, setCurrentShowState] = useState<ShowProgram>(getCurrentShow());
  const [nextShow, setNextShow] = useState<ShowProgram>(getNextShow(currentShow.id));
  const [showProgress, setShowProgress] = useState<number>(45);

  const setCurrentShow = (show: ShowProgram) => {
    setCurrentShowState(show);
    setNextShow(getNextShow(show.id));
  };

  // Verses state with localStorage
  const [verses, setVerses] = useState<DailyVerse[]>(() => {
    try {
      const saved = localStorage.getItem('vozdafe_verses');
      return saved ? JSON.parse(saved) : DAILY_VERSES;
    } catch {
      return DAILY_VERSES;
    }
  });
  const [activeVerseIdx, setActiveVerseIdx] = useState<number>(0);

  // Station settings state with localStorage
  const [stationSettings, setStationSettings] = useState<typeof RADIO_STATION>(() => {
    try {
      const saved = localStorage.getItem('vozdafe_station');
      return saved ? JSON.parse(saved) : RADIO_STATION;
    } catch {
      return RADIO_STATION;
    }
  });

  const updateStationSettings = (updates: Partial<typeof RADIO_STATION>) => {
    const updated = { ...stationSettings, ...updates };
    setStationSettings(updated);
    try {
      localStorage.setItem('vozdafe_station', JSON.stringify(updated));
    } catch {
      // safe fallback
    }
  };

  // Navigation tab & Control Panel toggle
  const [activeTab, setActiveTab] = useState<string>('ao-vivo');
  const [isControlPanelOpen, setIsControlPanelOpen] = useState<boolean>(false);

  // Sleep Timer
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemainingSec, setSleepTimerRemainingSec] = useState<number | null>(null);

  // Prayer Requests with Firestore
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(INITIAL_PRAYER_REQUESTS);

  useEffect(() => {
    const q = query(collection(db, 'prayerRequests'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const prayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerRequest));
        setPrayerRequests(prayers);
      } else {
        setPrayerRequests(INITIAL_PRAYER_REQUESTS);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'prayerRequests');
    });
    return unsubscribe;
  }, []);

  // Song Requests com Firestore
  const [songRequests, setSongRequests] = useState<SongRequest[]>(INITIAL_SONG_REQUESTS);

  useEffect(() => {
    const q = query(collection(db, 'songRequests'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const songs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SongRequest));
        setSongRequests(songs);
      } else {
        setSongRequests(INITIAL_SONG_REQUESTS);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'songRequests');
    });
    return unsubscribe;
  }, []);

  // Contact Messages com Firestore (apenas monitorado para administrador autenticado)
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(INITIAL_CONTACT_MESSAGES);

  useEffect(() => {
    let unsubscribeMessages: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
        unsubscribeMessages = null;
      }

      if (user && (user.email === 'vibraefm@gmail.com' || (user.email && user.email.toLowerCase().includes('admin')))) {
        const q = query(collection(db, 'contactMessages'));
        unsubscribeMessages = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
            setContactMessages(messages);
          } else {
            setContactMessages(INITIAL_CONTACT_MESSAGES);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'contactMessages');
        });
      } else {
        setContactMessages([]);
      }
    });

    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
      unsubscribeAuth();
    };
  }, []);

  // Podcasts com Firestore (com fallback para episódios da rádio caso a coleção esteja vazia)
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(PODCAST_EPISODES);

  useEffect(() => {
    const q = query(collection(db, 'podcasts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const podcastList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PodcastEpisode));
        setPodcasts(podcastList);
      } else {
        setPodcasts(PODCAST_EPISODES);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'podcasts');
    });
    return unsubscribe;
  }, []);

  // Live Radio API Data State
  const [radioData, setRadioData] = useState<RadioAPIData | null>(() => ({
    status: 'NO AR',
    porta: '8912',
    porta_dj: '',
    ip: 'server15.srvsh.com.br',
    ouvintes_conectados: 128,
    titulo: 'RÁDIO VÓZ DA FÉ',
    plano_ouvintes: 1000,
    plano_ftp: 5000,
    plano_bitrate: '128 kbps',
    musica_atual: 'Louvores que Edificam • Ao Vivo',
    proxima_musica: 'Bondade de Deus — Louvor & Adoração',
    genero: 'Gospel / Louvor & Adoração',
    shoutcast: 'https://server15.srvsh.com.br:8912/;',
    rtmp: '',
    rtsp: '',
    capa_musica: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    isOnline: true,
    lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }));

  const [isRadioLoading, setIsRadioLoading] = useState<boolean>(false);
  const [lastRadioUpdate, setLastRadioUpdate] = useState<string | null>(null);
  const [radioError, setRadioError] = useState<string | null>(null);

  // Compute effective stream URL (defaults to real user live stream: https://server15.srvsh.com.br:8912/;)
  const getEffectiveStreamUrl = useCallback((data: RadioAPIData | null, qual: StreamQuality): string => {
    const raw = data?.shoutcast || qual?.url || 'https://server15.srvsh.com.br:8912/;';
    if (raw && typeof raw === 'string') {
      let url = raw.trim();
      // Ensure shoutcast server15.srvsh.com.br:8912 has /; audio stream suffix
      if (url === 'https://server15.srvsh.com.br:8912' || url === 'http://server15.srvsh.com.br:8912' || url === 'https://server15.srvsh.com.br:8912/' || url === 'http://server15.srvsh.com.br:8912/') {
        return 'https://server15.srvsh.com.br:8912/;';
      }
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http:')) {
        return `/api/stream?url=${encodeURIComponent(url)}`;
      }
      return url;
    }
    return 'https://server15.srvsh.com.br:8912/;';
  }, []);

  const effectiveStreamUrl = getEffectiveStreamUrl(radioData, currentQuality);

  // Fetch radio data from official API with safe fallback
  const fetchRadioData = useCallback(async () => {
    try {
      setIsRadioLoading(true);
      setRadioError(null);

      let rawData: any = null;

      // Strategy 1: Node.js Express server proxy (/api/radio)
      try {
        const res = await fetch('/api/radio', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json && typeof json === 'object') {
            rawData = json;
          }
        }
      } catch {
        // Continue to fallback
      }

      // Strategy 2: Direct HTTPS fetch from srvsh.com.br
      if (!rawData || typeof rawData !== 'object') {
        try {
          const directRes = await fetch('https://srvsh.com.br/api-json/VkRCU2NtVkZNVzVRVkRBOStS', {
            cache: 'no-store'
          });
          if (directRes.ok) {
            const json = await directRes.json();
            if (json && typeof json === 'object') {
              rawData = json;
            }
          }
        } catch {
          // Continue to fallback
        }
      }

      // Strategy 3: Public CORS proxy as backup
      if (!rawData || typeof rawData !== 'object') {
        try {
          const corsRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('http://srvsh.com.br/api-json/VkRCU2NtVkZNVzVRVkRBOStS')}`);
          if (corsRes.ok) {
            const json = await corsRes.json();
            if (json && typeof json === 'object') {
              rawData = json;
            }
          }
        } catch {
          // Fallback handled below
        }
      }

      const timestamp = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastRadioUpdate(timestamp);

      if (rawData && typeof rawData === 'object' && rawData !== null) {
        const isOnline = rawData.isOnline ?? (
          rawData.status === 'Ligado' ||
          rawData.status === 'NO AR' ||
          rawData.status === true ||
          Boolean(rawData.shoutcast || rawData.porta)
        );

        const normalized: RadioAPIData = {
          status: rawData.status || (isOnline ? 'NO AR' : 'Aguardando transmissão'),
          porta: String(rawData.porta || '8000'),
          porta_dj: String(rawData.porta_dj || ''),
          ip: String(rawData.ip || 'srvsh.com.br'),
          ouvintes_conectados: Number(rawData.ouvintes_conectados) || 0,
          titulo: rawData.titulo || RADIO_STATION.name,
          plano_ouvintes: Number(rawData.plano_ouvintes) || 1000,
          plano_ftp: Number(rawData.plano_ftp) || 5000,
          plano_bitrate: String(rawData.plano_bitrate || '128 kbps'),
          musica_atual: rawData.musica_atual || 'Transmissão Ao Vivo',
          proxima_musica: rawData.proxima_musica || '',
          genero: rawData.genero || 'Gospel / Louvor & Adoração',
          shoutcast: rawData.shoutcast || '',
          rtmp: rawData.rtmp || '',
          rtsp: rawData.rtsp || '',
          capa_musica: rawData.capa_musica || '',
          lastUpdated: timestamp,
          isOnline
        };

        setRadioData(normalized);

        // Update currentTrackInfo if API returned real music name
        if (normalized.musica_atual && normalized.musica_atual !== 'Transmissão Ao Vivo') {
          let trackTitle = normalized.musica_atual;
          let trackArtist = normalized.titulo || RADIO_STATION.name;
          if (trackTitle.includes(' - ')) {
            const parts = trackTitle.split(' - ');
            trackArtist = parts[0].trim();
            trackTitle = parts.slice(1).join(' - ').trim();
          }
          setCurrentTrackInfo({
            title: trackTitle,
            artist: trackArtist,
            album: normalized.genero || 'Transmissão Ao Vivo'
          });
        }
      } else if (rawData === false || rawData === 'false') {
        // Stream server is currently idle/stopped on provider
        setRadioData(prev => ({
          ...(prev || {}),
          status: 'Offline / Aguardando início no estúdio',
          isOnline: false,
          lastUpdated: timestamp
        }));
      }
    } catch {
      setRadioError('Falha temporária ao consultar dados do servidor.');
    } finally {
      setIsRadioLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRadioData();
    const interval = setInterval(fetchRadioData, 20000); // Poll every 20 seconds
    return () => clearInterval(interval);
  }, [fetchRadioData]);

  // Automatic hash check for studio / control panel
  useEffect(() => {
    const checkHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#painel' || h === '#admin' || h === '#estudio' || h === '#dashboard') {
        setIsControlPanelOpen(true);
      } else if (h === '#/login' || h === '#login') {
        setActiveTab('login');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Dynamic Current Track Info
  const [currentTrackInfo, setCurrentTrackInfo] = useState({
    title: "Porque Ele Vive (Ao Vivo)",
    artist: "Harpa Cristã Contemporânea",
    album: "Adoração & Graça 2026"
  });

  // Rotate simulated broadcast tracks every 4 minutes if not manually set
  useEffect(() => {
    const playlist = [
      { title: "Porque Ele Vive (Ao Vivo)", artist: "Harpa Cristã Contemporânea", album: "Adoração & Graça" },
      { title: "Bondade de Deus (Goodness of God)", artist: "Ministério de Louvor Vóz da Fé", album: "Voz da Esperança" },
      { title: "Grandioso És Tu (Piano & Cordas)", artist: "Orquestra Sacra de São Paulo", album: "Hinos Clássicos Vol. 4" },
      { title: "O Escudo e a Fortaleza", artist: "Voz da Fé Adoração", album: "Clamor das Nações" },
      { title: "Em Fervente Oração", artist: "Coral Harpa de Davi", album: "Vigília & Comunhão" }
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % playlist.length;
      setCurrentTrackInfo(playlist[idx]);
    }, 240000);
    return () => clearInterval(interval);
  }, []);

  // Update show every minute
  useEffect(() => {
    const updateShowTimes = () => {
      const cur = getCurrentShow();
      setCurrentShowState(cur);
      setNextShow(getNextShow(cur.id));

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = cur.startHour * 60 + cur.startMinute;
      let endMinutes = cur.endHour * 60 + cur.endMinute;
      if (endMinutes <= startMinutes) endMinutes = 24 * 60;

      const duration = Math.max(1, endMinutes - startMinutes);
      const elapsed = Math.max(0, currentMinutes - startMinutes);
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setShowProgress(pct);
    };

    updateShowTimes();
    const interval = setInterval(updateShowTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    audioRef.current = audio;

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setAudioError(null);
    };
    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setActivePodcast(null);
      if (audioRef.current) {
        audioRef.current.src = effectiveStreamUrl;
        audioRef.current.load();
      }
    };
    const handleError = () => {
      console.warn("Audio element error. Switching to fallback safe stream.");
      setIsLoading(false);
      if (audio.src !== STREAM_QUALITIES[0].url) {
        audio.src = STREAM_QUALITIES[0].url;
        audio.load();
        if (isPlaying) {
          audio.play().catch(e => {
            console.error("Fallback play failed:", e);
            setAudioError("Erro ao carregar áudio. Clique em reconectar.");
            setIsPlaying(false);
          });
        }
      } else {
        setAudioError("Conexão instável. Clique para reconectar.");
        setIsPlaying(false);
      }
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = "";
    };
  }, [effectiveStreamUrl, isPlaying]);

  // Sleep timer ticker
  useEffect(() => {
    if (sleepTimerRemainingSec === null) return;
    if (sleepTimerRemainingSec <= 0) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setSleepTimerMinutes(null);
      setSleepTimerRemainingSec(null);
      return;
    }

    const timer = setInterval(() => {
      setSleepTimerRemainingSec(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerRemainingSec]);

  // Volume & Mute handling
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setAudioError(null);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      const targetUrl = activePodcast ? activePodcast.audioUrl : effectiveStreamUrl;
      if (audioRef.current.src !== targetUrl) {
        audioRef.current.src = targetUrl;
        audioRef.current.load();
      }
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn("Autoplay or stream load prevented:", err);
          setIsLoading(false);
          setIsPlaying(false);
          setAudioError("Clique para iniciar a transmissão");
        });
    }
  };

  // Media Session API Sync (Lock screen & notifications)
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      const title = activePodcast
        ? activePodcast.title
        : (currentTrackInfo?.title || radioData?.musica_atual || 'Transmissão Ao Vivo');
      const artist = activePodcast
        ? activePodcast.preacher
        : (currentTrackInfo?.artist || radioData?.titulo || RADIO_STATION.name);
      const album = activePodcast
        ? 'Ministração da Palavra'
        : (currentShow?.title || RADIO_STATION.slogan);
      const artworkSrc = activePodcast?.coverImage || radioData?.capa_musica || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=512&auto=format&fit=crop&q=80';

      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        album,
        artwork: [
          { src: artworkSrc, sizes: '96x96', type: 'image/jpeg' },
          { src: artworkSrc, sizes: '128x128', type: 'image/jpeg' },
          { src: artworkSrc, sizes: '192x192', type: 'image/jpeg' },
          { src: artworkSrc, sizes: '256x256', type: 'image/jpeg' },
          { src: artworkSrc, sizes: '384x384', type: 'image/jpeg' },
          { src: artworkSrc, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        if (!isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (isPlaying) togglePlay();
      });
    } catch {
      // Safe fallback for partial mediaSession support
    }
  }, [isPlaying, activePodcast, currentTrackInfo, currentShow, radioData]);

  const retryPlayback = () => {
    if (!audioRef.current) return;
    setAudioError(null);
    setIsLoading(true);
    audioRef.current.src = activePodcast ? activePodcast.audioUrl : effectiveStreamUrl;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setAudioError("Não foi possível conectar. Verifique sua rede.");
      });
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    try {
      localStorage.setItem('vozdafe_volume', vol.toString());
    } catch {
      // safe fallback
    }
    if (vol > 0 && isMuted) {
      setIsMuted(false);
      try {
        localStorage.setItem('vozdafe_muted', 'false');
      } catch {
        // safe fallback
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      try {
        localStorage.setItem('vozdafe_muted', next.toString());
      } catch {
        // safe fallback
      }
      return next;
    });
  };

  const setQuality = (quality: StreamQuality) => {
    setCurrentQuality(quality);
    if (audioRef.current && !activePodcast) {
      const wasPlaying = isPlaying;
      audioRef.current.src = quality.url;
      audioRef.current.load();
      if (wasPlaying) {
        setIsLoading(true);
        audioRef.current.play().then(() => {
          setIsLoading(false);
          setIsPlaying(true);
        }).catch(() => {
          setIsLoading(false);
        });
      }
    }
  };

  const setSleepTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    if (minutes === null) {
      setSleepTimerRemainingSec(null);
    } else {
      setSleepTimerRemainingSec(minutes * 60);
    }
  };

  const playPodcast = (podcast: PodcastEpisode) => {
    setActivePodcast(podcast);
    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = podcast.audioUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Podcast play failed:", err);
        setIsLoading(false);
      });
    }
  };

  const stopPodcast = () => {
    setActivePodcast(null);
    if (audioRef.current) {
      audioRef.current.src = currentQuality.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  // Prayer Request Handlers
  const addPrayerRequest = async (data: {
    authorName: string;
    city: string;
    state: string;
    category: PrayerRequest['category'];
    content: string;
  }) => {
    try {
      await addDoc(collection(db, 'prayerRequests'), {
        authorName: data.authorName,
        city: data.city,
        state: data.state.toUpperCase(),
        category: data.category,
        content: data.content,
        createdAt: new Date().toISOString(),
        prayersCount: 1,
        hasUserPrayed: true
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'prayerRequests');
    }

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#e6b86b', '#f7f5ef', '#102b28']
      });
    } catch {
      // ignore
    }
  };

  const prayForRequest = async (id: string) => {
    const prayerRef = doc(db, 'prayerRequests', id);
    const prayer = prayerRequests.find(p => p.id === id);
    if (!prayer) return;
    
    try {
      await updateDoc(prayerRef, {
        prayersCount: (prayer.prayersCount || 0) + 1
      });
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#e6b86b', '#f7f5ef', '#102b28']
        });
      } catch {
        // ignore
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `prayerRequests/${id}`);
    }
  };

  const deletePrayerRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'prayerRequests', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `prayerRequests/${id}`);
    }
  };

  const updatePrayerRequest = async (id: string, updates: Partial<PrayerRequest>) => {
    try {
      await updateDoc(doc(db, 'prayerRequests', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `prayerRequests/${id}`);
    }
  };

  // Song Request Handlers
  const addSongRequest = async (data: {
    listenerName: string;
    city: string;
    songTitle: string;
    artist: string;
    dedicationTo: string;
    message?: string;
  }) => {
    try {
      await addDoc(collection(db, 'songRequests'), {
        ...data,
        requestedAt: new Date().toISOString(),
        status: "na_fila"
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'songRequests');
    }
  };

  const updateSongRequestStatus = async (id: string, status: SongRequest['status']) => {
    try {
      await updateDoc(doc(db, 'songRequests', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `songRequests/${id}`);
    }
  };

  const deleteSongRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'songRequests', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `songRequests/${id}`);
    }
  };

  // Schedule Management Handlers
  const addProgram = (prog: ShowProgram) => {
    const updated = [...programs, prog];
    setPrograms(updated);
    try {
      localStorage.setItem('vozdafe_programs', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updateProgram = (id: string, updates: Partial<ShowProgram>) => {
    const updated = programs.map(p => p.id === id ? { ...p, ...updates } : p);
    setPrograms(updated);
    try {
      localStorage.setItem('vozdafe_programs', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteProgram = (id: string) => {
    const updated = programs.filter(p => p.id !== id);
    setPrograms(updated);
    try {
      localStorage.setItem('vozdafe_programs', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Verses Management Handlers
  const addVerse = (verse: DailyVerse) => {
    const updated = [...verses, verse];
    setVerses(updated);
    try {
      localStorage.setItem('vozdafe_verses', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updateVerse = (id: string, updates: Partial<DailyVerse>) => {
    const updated = verses.map(v => v.id === id ? { ...v, ...updates } : v);
    setVerses(updated);
    try {
      localStorage.setItem('vozdafe_verses', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteVerse = (id: string) => {
    const updated = verses.filter(v => v.id !== id);
    setVerses(updated);
    try {
      localStorage.setItem('vozdafe_verses', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Contact Messages Handlers
  const addContactMessage = async (msg: { name: string; email: string; subject: string; message: string }) => {
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...msg,
        sentAt: new Date().toISOString(),
        status: 'nova'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contactMessages');
    }
  };

  const updateContactMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contactMessages/${id}`);
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contactMessages/${id}`);
    }
  };

  // Podcasts Handlers
  const addPodcast = async (pod: PodcastEpisode) => {
    try {
      await addDoc(collection(db, 'podcasts'), pod);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'podcasts');
    }
  };

  const deletePodcast = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'podcasts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `podcasts/${id}`);
    }
  };

  return (
    <RadioContext.Provider
      value={{
        isPlaying,
        isLoading,
        volume,
        isMuted,
        currentQuality,
        togglePlay,
        setVolume,
        toggleMute,
        setQuality,
        audioError,
        retryPlayback,
        currentShow,
        setCurrentShow,
        nextShow,
        showProgress,
        currentTrackInfo,
        setCurrentTrackInfo,
        sleepTimerMinutes,
        sleepTimerRemainingSec,
        setSleepTimer,
        prayerRequests,
        addPrayerRequest,
        prayForRequest,
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
        addContactMessage,
        updateContactMessageStatus,
        deleteContactMessage,
        podcasts,
        addPodcast,
        deletePodcast,
        stationSettings,
        updateStationSettings,
        activeTab,
        setActiveTab,
        isControlPanelOpen,
        setIsControlPanelOpen,
        activePodcast,
        playPodcast,
        stopPodcast,
        radioData,
        isRadioLoading,
        lastRadioUpdate,
        radioError,
        refreshRadioData: fetchRadioData,
        effectiveStreamUrl
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
