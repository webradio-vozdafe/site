import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';

const RADIO_API_URL = 'http://srvsh.com.br/api-json/VkRCU2NtVkZNVzVRVkRBOStS';

let cachedRadioData: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds cache
let pendingFetch: Promise<any> | null = null;

async function fetchUpstreamRadioData(): Promise<any> {
  const now = Date.now();
  if (cachedRadioData && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedRadioData;
  }

  if (pendingFetch) {
    return pendingFetch;
  }

  pendingFetch = (async () => {
    try {
      const response = await axios.get(RADIO_API_URL, {
        timeout: 22000,
        headers: {
          'User-Agent': 'VozDaFeRadioWeb/1.0 (Mozilla/5.0)',
          'Cache-Control': 'no-cache'
        },
        maxRedirects: 5
      });

      const raw = response.data;
      const formattedTimestamp = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // If upstream returns false or null, the streaming daemon is stopped or offline
      if (!raw || raw === false || raw === 'false' || (typeof raw === 'object' && raw.status === false)) {
        cachedRadioData = {
          isOnline: false,
          status: 'Offline / Aguardando transmissão',
          titulo: 'Rádio Vóz da Fé',
          genero: 'Gospel / Louvor & Adoração',
          musica_atual: 'Programação de Louvor & Adoração',
          proxima_musica: '',
          ouvintes_conectados: 0,
          shoutcast: '',
          capa_musica: '',
          lastUpdated: formattedTimestamp
        };
      } else if (typeof raw === 'object') {
        const isOnline = raw.status === 'Ligado' || raw.status === 'NO AR' || raw.status === true || Boolean(raw.shoutcast || raw.porta);
        cachedRadioData = {
          ...raw,
          isOnline,
          status: raw.status || (isOnline ? 'NO AR' : 'Offline'),
          titulo: raw.titulo || 'Rádio Vóz da Fé',
          genero: raw.genero || 'Gospel',
          musica_atual: raw.musica_atual || 'Louvor e Edificação',
          proxima_musica: raw.proxima_musica || '',
          ouvintes_conectados: Number(raw.ouvintes_conectados) || 0,
          shoutcast: raw.shoutcast || '',
          capa_musica: raw.capa_musica || '',
          lastUpdated: formattedTimestamp
        };
      } else {
        cachedRadioData = {
          isOnline: false,
          status: 'Aguardando sinal',
          titulo: 'Rádio Vóz da Fé',
          musica_atual: 'Louvor & Palavra',
          lastUpdated: formattedTimestamp
        };
      }

      lastFetchTime = Date.now();
      return cachedRadioData;
    } catch {
      lastFetchTime = Date.now();
      if (cachedRadioData) {
        return cachedRadioData;
      }
      return {
        isOnline: false,
        status: 'Aguardando transmissão',
        titulo: 'Rádio Vóz da Fé',
        musica_atual: 'Louvor & Palavra',
        ouvintes_conectados: 0,
        lastUpdated: new Date().toLocaleTimeString('pt-BR')
      };
    } finally {
      pendingFetch = null;
    }
  })();

  return pendingFetch;
}

async function createServer() {
  const app = express();

  // CORS headers for all local routes
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // API Proxy Route for Radio JSON
  app.get('/api/radio', async (req, res) => {
    try {
      const data = await fetchUpstreamRadioData();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.json(data);
    } catch (error: any) {
      res.status(500).json({
        error: 'Erro ao consultar a API da rádio',
        details: error?.message || String(error)
      });
    }
  });

  // Audio Stream Proxy to prevent mixed-content blocks when listening from HTTPS
  app.get('/api/stream', async (req, res) => {
    try {
      const radio = await fetchUpstreamRadioData();
      let targetUrl = (req.query.url as string) || radio?.shoutcast || 'https://server15.srvsh.com.br:8912/;';
      if (targetUrl === 'https://server15.srvsh.com.br:8912' || targetUrl === 'http://server15.srvsh.com.br:8912' || targetUrl === 'https://server15.srvsh.com.br:8912/' || targetUrl === 'http://server15.srvsh.com.br:8912/') {
        targetUrl = 'https://server15.srvsh.com.br:8912/;';
      }

      if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
        return res.status(404).send('Nenhum endereço de streaming válido disponível no momento.');
      }

      const streamRes = await axios({
        method: 'get',
        url: targetUrl,
        responseType: 'stream',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VozDaFePlayer/1.0',
          'Icy-MetaData': '1'
        }
      });

      res.setHeader('Content-Type', streamRes.headers['content-type'] || 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-cache, no-store');
      streamRes.data.pipe(res);
    } catch {
      res.status(502).send('Falha ao conectar com o servidor Shoutcast da rádio.');
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
}

createServer();
