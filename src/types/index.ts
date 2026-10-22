export interface ShowProgram {
  id: string;
  title: string;
  host: string;
  hostRole: string;
  timeSlot: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  description: string;
  image: string;
  days: number[]; // 0 = Domingo, 1 = Segunda, ... 6 = Sábado
  tags: string[];
}

export interface PrayerRequest {
  id: string;
  authorName: string;
  city: string;
  state: string;
  category: 'Saúde' | 'Família' | 'Vida Espiritual' | 'Finanças' | 'Gratidão' | 'Causas Urgentes';
  content: string;
  createdAt: string;
  prayersCount: number;
  hasUserPrayed?: boolean;
}

export interface SongRequest {
  id: string;
  listenerName: string;
  city: string;
  songTitle: string;
  artist: string;
  dedicationTo: string;
  message?: string;
  requestedAt: string;
  status: 'no_ar' | 'na_fila' | 'atendido';
}

export interface DailyVerse {
  id: string;
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
  theme: string;
  devotionalText: string;
  pastorCommentary: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  preacher: string;
  date: string;
  duration: string;
  audioUrl: string;
  description: string;
  coverImage: string;
  plays: number;
}

export interface StreamQuality {
  label: string;
  bitrate: string;
  url: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
  status: 'nova' | 'lida' | 'respondida';
}

export interface RadioAPIData {
  status: string | boolean;
  porta?: string;
  porta_dj?: string;
  ip?: string;
  ouvintes_conectados?: number;
  titulo?: string;
  plano_ouvintes?: number;
  plano_ftp?: number;
  plano_bitrate?: string;
  musica_atual?: string;
  proxima_musica?: string;
  genero?: string;
  shoutcast?: string;
  rtmp?: string;
  rtsp?: string;
  capa_musica?: string;
  lastUpdated?: string;
  isOnline?: boolean;
}
