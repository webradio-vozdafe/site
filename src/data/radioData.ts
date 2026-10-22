import { ShowProgram, PrayerRequest, SongRequest, DailyVerse, PodcastEpisode, StreamQuality, ContactMessage } from '../types';

export const RADIO_STATION = {
  name: "Rádio Vóz da Fé",
  slogan: "A frequência do céu tocando o seu coração",
  frequency: "FM 104.9 MHz & Web HD",
  location: "São Paulo, SP - Brasil",
  whatsapp: "+55 11 98765-4321",
  phone: "(11) 3221-5000",
  email: "contato@vozdafe.radio.br",
  onlineListeners: 4280,
  yearsOnAir: "12 Anos",
};

export const STREAM_URL = "https://server15.srvsh.com.br:8912/;";

export const STREAM_QUALITIES: StreamQuality[] = [
  {
    label: "Ao Vivo HD (128 kbps)",
    bitrate: "128 kbps",
    url: "https://server15.srvsh.com.br:8912/;"
  },
  {
    label: "Alta Fidelidade (128 kbps)",
    bitrate: "128 kbps",
    url: "https://server15.srvsh.com.br:8912/stream"
  },
  {
    label: "Economia (64 kbps)",
    bitrate: "64 kbps",
    url: "https://server15.srvsh.com.br:8912/;"
  }
];

export const SCHEDULE_PROGRAMS: ShowProgram[] = [
  {
    id: "prog-1",
    title: "Madrugada de Clamor e Paz",
    host: "Equipe Pastoral Vóz da Fé",
    hostRole: "Vigília & Intercessão",
    timeSlot: "00:00 - 05:00",
    startHour: 0,
    startMinute: 0,
    endHour: 5,
    endMinute: 0,
    description: "Momentos de oração fervorosa na madrugada, hinos clássicos de harpa cristã e mensagens para quem busca consolo e refrigério nas horas de vigília.",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=80",
    days: [0, 1, 2, 3, 4, 5, 6],
    tags: ["Oração", "Vigília", "Harpa Cristã"]
  },
  {
    id: "prog-2",
    title: "Amanhecer com Cristo",
    host: "Pr. Marcos Lima",
    hostRole: "Pastor Presidente",
    timeSlot: "05:00 - 08:00",
    startHour: 5,
    startMinute: 0,
    endHour: 8,
    endMinute: 0,
    description: "Comece o seu dia com a Palavra de Deus, reflexões diárias, oração pelo pão de cada dia e os melhores louvores matinais para inspirar sua jornada.",
    image: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop&q=80",
    days: [1, 2, 3, 4, 5],
    tags: ["Devocional", "Palavra Matinal", "Louvor"]
  },
  {
    id: "prog-3",
    title: "Voz da Fé no Ar",
    host: "Missionária Sarah Costa",
    hostRole: "Apresentadora e Missionária",
    timeSlot: "08:00 - 10:00",
    startHour: 8,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    description: "O programa oficial da emissora! Participação dos ouvintes pelo WhatsApp, testemunhos de milagres recebidos, oração ao vivo e lançamentos da música gospel.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
    days: [1, 2, 3, 4, 5, 6],
    tags: ["Ao Vivo", "Testemunhos", "Participação"]
  },
  {
    id: "prog-4",
    title: "Manhã de Avivamento",
    host: "Pr. David Oliveira",
    hostRole: "Ministro de Ensino Bíblico",
    timeSlot: "10:00 - 12:00",
    startHour: 10,
    startMinute: 0,
    endHour: 12,
    endMinute: 0,
    description: "Estudos bíblicos aprofundados, mensagens de fortalecimento espiritual, adoração congregacional e intercessão pela saúde física e emocional.",
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80",
    days: [1, 2, 3, 4, 5],
    tags: ["Estudo Bíblico", "Cura Divina", "Avivamento"]
  },
  {
    id: "prog-5",
    title: "Conexão Gospel & Notícias do Reino",
    host: "Débora Santos",
    hostRole: "Jornalista Cristã",
    timeSlot: "12:00 - 14:00",
    startHour: 12,
    startMinute: 0,
    endHour: 14,
    endMinute: 0,
    description: "O que acontece no mundo cristão no Brasil e no exterior, missões transculturais, lançamentos fonográficos e entrevistas com cantores e líderes.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    days: [1, 2, 3, 4, 5],
    tags: ["Notícias", "Entrevistas", "Missões"]
  },
  {
    id: "prog-6",
    title: "Tarde de Bênçãos & Pedidos do Ouvinte",
    host: "Ev. Gabriel Souza",
    hostRole: "Locutor & Evangelista",
    timeSlot: "14:00 - 17:00",
    startHour: 14,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    description: "A sua música favorita toca aqui! Atendendo pedidos de hinos feitos através do site e WhatsApp, recados carinhosos para famílias e igrejas.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=80",
    days: [1, 2, 3, 4, 5, 6],
    tags: ["Pedidos Musicais", "Mural no Ar", "Interatividade"]
  },
  {
    id: "prog-7",
    title: "Momento da Família & Aliança",
    host: "Pr. Samuel e Pra. Raquel",
    hostRole: "Conselheiros Familiares",
    timeSlot: "17:00 - 19:00",
    startHour: 17,
    startMinute: 0,
    endHour: 19,
    endMinute: 0,
    description: "Diálogos sobre casamento cristão, educação dos filhos na fé, superação de crises no lar e bênção sacerdotal para todas as famílias ouvintes.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80",
    days: [1, 2, 3, 4, 5],
    tags: ["Família", "Casamento", "Aconselhamento"]
  },
  {
    id: "prog-8",
    title: "Voz de Louvor & Adoração",
    host: "Pr. André Carvalho",
    hostRole: "Ministro de Música",
    timeSlot: "19:00 - 21:00",
    startHour: 19,
    startMinute: 0,
    endHour: 21,
    endMinute: 0,
    description: "O melhor da adoração contemporânea e hinos inesquecíveis. Um ambiente de adoração contínua que enche sua casa da presença do Espírito Santo.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    days: [0, 1, 2, 3, 4, 5, 6],
    tags: ["Adoração", "Praise", "Comunhão"]
  },
  {
    id: "prog-9",
    title: "Noite de Esperança & Oração Final",
    host: "Diácono Lucas Rocha",
    hostRole: "Ministro de Oração",
    timeSlot: "21:00 - 00:00",
    startHour: 21,
    startMinute: 0,
    endHour: 24,
    endMinute: 0,
    description: "Antes de descansar, traga suas ansiedades ao altar de Deus. Leitura dos pedidos de oração recebidos durante o dia e clamor pelos enfermos.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80",
    days: [0, 1, 2, 3, 4, 5, 6],
    tags: ["Clamor", "Descanso", "Esperança"]
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: "pray-1",
    authorName: "Dona Maria da Glória",
    city: "Campinas",
    state: "SP",
    category: "Saúde",
    content: "Peço oração pela recuperação da minha mãe que passou por uma cirurgia cardíaca esta semana. Cremos que pelas pisaduras de Jesus ela já foi sarada!",
    createdAt: "Há 15 minutos",
    prayersCount: 47,
    hasUserPrayed: false
  },
  {
    id: "pray-2",
    authorName: "Carlos Eduardo Oliveira",
    city: "Belo Horizonte",
    state: "MG",
    category: "Finanças",
    content: "Irmãos, peço intercessão por uma porta de emprego. Estou há 6 meses procurando colocação para honrar os compromissos da minha família.",
    createdAt: "Há 42 minutos",
    prayersCount: 32,
    hasUserPrayed: false
  },
  {
    id: "pray-3",
    authorName: "Irmã Luciana Fernandes",
    city: "Curitiba",
    state: "PR",
    category: "Família",
    content: "Orem pela reconciliação do meu filho Tiago com o Senhor Jesus e pela paz em nosso lar. Que o amor de Cristo quebre todo laço.",
    createdAt: "Há 1 hora",
    prayersCount: 65,
    hasUserPrayed: false
  },
  {
    id: "pray-4",
    authorName: "Pastor Josué Mendes",
    city: "Recife",
    state: "PE",
    category: "Vida Espiritual",
    content: "Clamor pelo avivamento de nossa juventude e pelos retiros espirituais deste mês. Que muitas vidas sejam batizadas no Espírito Santo.",
    createdAt: "Há 2 horas",
    prayersCount: 88,
    hasUserPrayed: false
  },
  {
    id: "pray-5",
    authorName: "Tatiane e Roberto",
    city: "Goiânia",
    state: "GO",
    category: "Gratidão",
    content: "Testemunho de gratidão ao Senhor! Depois de 4 anos de oração nesta rádio, Deus nos abençoou com a chegada da nossa filha Sara. Glória a Deus!",
    createdAt: "Há 3 horas",
    prayersCount: 112,
    hasUserPrayed: false
  },
  {
    id: "pray-6",
    authorName: "Marcos Vinicius",
    city: "Rio de Janeiro",
    state: "RJ",
    category: "Causas Urgentes",
    content: "Peço clamor urgente por um processo jurídico importante que será julgado nesta semana. Que prevaleça a justiça e a fidelidade de Deus.",
    createdAt: "Há 4 horas",
    prayersCount: 54,
    hasUserPrayed: false
  }
];

export const INITIAL_SONG_REQUESTS: SongRequest[] = [
  {
    id: "song-1",
    listenerName: "Cláudia Ribeiro",
    city: "Sorocaba/SP",
    songTitle: "Bondade de Deus",
    artist: "Isaías Saad",
    dedicationTo: "Para meu esposo Paulo e filhos",
    message: "Obrigada Senhor por cuidar de nós em todo tempo!",
    requestedAt: "Há 10 min",
    status: "no_ar"
  },
  {
    id: "song-2",
    listenerName: "Adilson Santos",
    city: "Salvador/BA",
    songTitle: "Lugar Secreto",
    artist: "Gabriela Rocha",
    dedicationTo: "Igreja Batista Monte Sião",
    message: "Que este louvor toque o coração dos irmãos reunidos.",
    requestedAt: "Há 25 min",
    status: "na_fila"
  },
  {
    id: "song-3",
    listenerName: "Fernanda Cristina",
    city: "Fortaleza/CE",
    songTitle: "Porque Ele Vive",
    artist: "Harpa Cristã / Fernandinho",
    dedicationTo: "Minha vovó Ana de 88 anos",
    message: "Hino predileto da minha avó que ouve a rádio todo dia!",
    requestedAt: "Há 35 min",
    status: "na_fila"
  },
  {
    id: "song-4",
    listenerName: "Pr. Renato Vieira",
    city: "Brasília/DF",
    songTitle: "Oceans (Onde Meus Pés Podem Falhar)",
    artist: "Ana Nóbrega",
    dedicationTo: "Todos os ouvintes de Brasília",
    message: "Confiando sempre no autor da nossa salvação.",
    requestedAt: "Há 1h",
    status: "atendido"
  }
];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Claudio Barbosa",
    email: "claudio.barbosa@gmail.com",
    subject: "Testemunho",
    message: "A paz do Senhor, equipe da Vóz da Fé! Estava desenganado pelos médicos no mês passado, mas através do clamor da Madrugada com o Pr. Marcos, Deus fez um milagre na minha saúde e os exames deram limpos! Toda glória a Deus!",
    sentAt: "Hoje, 09:42",
    status: "nova"
  },
  {
    id: "msg-2",
    name: "Marta Helena Silveira",
    email: "marta.helena@hotmail.com",
    subject: "Mensagem para a rádio",
    message: "Gostaria de parabenizar a locução da Missionária Sarah Costa. Suas palavras trazem tanta paz para a nossa casa. Ouvimos todos os dias na cozinha reunidos.",
    sentAt: "Hoje, 08:15",
    status: "lida"
  },
  {
    id: "msg-3",
    name: "Carlos Eduardo Nogueira",
    email: "carlos.nog@outlook.com",
    subject: "Sugestão",
    message: "Poderiam incluir mais hinos da Harpa Cristã no horário do almoço? É a melhor hora para nós que trabalhamos no comércio.",
    sentAt: "Ontem, 16:30",
    status: "respondida"
  }
];

export const DAILY_VERSES: DailyVerse[] = [
  {
    id: "verse-1",
    reference: "Isaías 40:31",
    book: "Isaías",
    chapter: 40,
    verse: 31,
    text: "Mas os que esperam no Senhor renovam as suas forças, sobem com asas como águias, correm e não se cansam, caminham e não se fatigam.",
    theme: "Renovação e Esperança",
    devotionalText: "Esperar no Senhor não é estagnação, mas a mais profunda atitude de fé. Quando suas próprias forças parecerem esgotadas pelas tempestades do dia a dia, lembre-se de que a fonte divina é inesgotável. Ele concede asas de águia para você planar acima das circunstâncias.",
    pastorCommentary: "Pr. Marcos Lima: 'Declare hoje que a sua força não vem dos homens, mas dAquele que criou os céus e a terra. Erga sua cabeça e confie.'"
  },
  {
    id: "verse-2",
    reference: "Filipenses 4:6-7",
    book: "Filipenses",
    chapter: 4,
    verse: 6,
    text: "Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas diante de Deus as vossas petições, pela oração e pela súplica, com ações de graças.",
    theme: "Paz em Meio à Tempestade",
    devotionalText: "A ansiedade sufoca a alma, mas a oração com gratidão abre as portas para uma paz que desafia a lógica humana. Entregue cada preocupação que tem tirado seu sono nas mãos do Pai.",
    pastorCommentary: "Missionária Sarah Costa: 'Troque a preocupação pelo louvor nesta manhã e sinta o peso saindo dos seus ombros.'"
  },
  {
    id: "verse-3",
    reference: "Salmos 23:1-3",
    book: "Salmos",
    chapter: 23,
    verse: 1,
    text: "O Senhor é o meu pastor; nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.",
    theme: "O Cuidado do Bom Pastor",
    devotionalText: "O Bom Pastor não nos promete ausência de vales sombrios, mas garante que Sua presença e Seu bordão nos acompanharão em cada milímetro da caminhada.",
    pastorCommentary: "Pr. David Oliveira: 'Descanse seu coração, você não está desamparado.'"
  }
];

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "ep-1",
    title: "Vencendo os Gigantes do Medo e da Ansiedade",
    preacher: "Pr. Marcos Lima",
    date: "18 de Outubro",
    duration: "18:45",
    audioUrl: "https://ia800301.us.archive.org/15/items/GospelMusicHymnsInstrumental/GospelHymnInstrumental.mp3",
    description: "Uma ministração poderosa sobre como a armadura da fé e a oração contínua silenciam as vozes do medo e restauram a serenidade na alma.",
    coverImage: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80",
    plays: 1240
  },
  {
    id: "ep-2",
    title: "O Altar no Lar: Restaurando a Comunhão Familiar",
    preacher: "Pra. Raquel e Pr. Samuel",
    date: "15 de Outubro",
    duration: "24:10",
    audioUrl: "https://ia600301.us.archive.org/15/items/GospelMusicHymnsInstrumental/AmazingGracePiano.mp3",
    description: "Conselhos práticos e bíblicos para reavivar o momento devocional em família, trazendo a proteção dos anjos para dentro de sua casa.",
    coverImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80",
    plays: 980
  },
  {
    id: "ep-3",
    title: "O Milagre da Gratidão em Tempos Difíceis",
    preacher: "Missionária Sarah Costa",
    date: "12 de Outubro",
    duration: "15:20",
    audioUrl: "https://ia800301.us.archive.org/15/items/GospelMusicHymnsInstrumental/GospelHymnInstrumental.mp3",
    description: "Por que louvar a Deus durante a provação quebra prisões espirituais, assim como aconteceu com Paulo e Silas no cárcere de Filipos.",
    coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    plays: 1530
  }
];

export function getCurrentShow(): ShowProgram {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const currentDay = now.getDay();

  const found = SCHEDULE_PROGRAMS.find((p) => {
    if (!p.days.includes(currentDay)) return false;
    const startTotal = p.startHour * 60 + p.startMinute;
    const endTotal = p.endHour === 24 || p.endHour === 0 && p.startHour > 12 ? 24 * 60 : p.endHour * 60 + p.endMinute;
    return currentTotalMinutes >= startTotal && currentTotalMinutes < endTotal;
  });

  return found || SCHEDULE_PROGRAMS[2]; // Default to Voz da Fé no Ar if edge case
}

export function getNextShow(currentShowId: string): ShowProgram {
  const currentIndex = SCHEDULE_PROGRAMS.findIndex(p => p.id === currentShowId);
  if (currentIndex === -1 || currentIndex === SCHEDULE_PROGRAMS.length - 1) {
    return SCHEDULE_PROGRAMS[0];
  }
  return SCHEDULE_PROGRAMS[currentIndex + 1];
}
