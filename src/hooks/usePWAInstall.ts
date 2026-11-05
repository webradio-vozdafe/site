import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    typeof window !== 'undefined' ? window.__pwaInstallPrompt || null : null
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    // 1. Detect iframe
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;
    setIsIframe(inIframe);

    // 2. Detect standalone (already installed)
    const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(display-mode: standalone)') : null;
    const isStandalone =
      typeof window !== 'undefined' &&
      (mediaQuery?.matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true);
    setIsInstalled(!!isStandalone);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsInstalled(true);
    };
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    // 3. User agent detection
    const ua = typeof window !== 'undefined' ? (window.navigator.userAgent || '').toLowerCase() : '';
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    const isAndroidDevice = /android/.test(ua);
    setIsAndroid(isAndroidDevice);

    // 4. In-App WebViews (WhatsApp, Instagram, Facebook, Messenger, TikTok)
    const inApp = /(instagram|fbav|fbios|fban|messenger|whatsapp|bytedance|line|twitter|snapchat)/i.test(ua);
    setIsInAppBrowser(inApp);

    // 5. Update prompt state if already captured
    if (window.__pwaInstallPrompt) {
      setDeferredPrompt(window.__pwaInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__pwaInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      window.__pwaInstallPrompt = null;
      setDeferredPrompt(null);
    };

    const handlePromptCaptured = () => {
      if (window.__pwaInstallPrompt) {
        setDeferredPrompt(window.__pwaInstallPrompt);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-prompt-captured', handlePromptCaptured);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-prompt-captured', handlePromptCaptured);
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    const promptToUse = deferredPrompt || (typeof window !== 'undefined' ? window.__pwaInstallPrompt : null);
    if (!promptToUse) {
      return false;
    }
    try {
      await promptToUse.prompt();
      const { outcome } = await promptToUse.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        window.__pwaInstallPrompt = null;
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('PWA install prompt error:', err);
    }
    return false;
  }, [deferredPrompt]);

  return {
    isInstallable: !!(deferredPrompt || (typeof window !== 'undefined' && window.__pwaInstallPrompt)),
    isInstalled,
    isStandalone: isInstalled,
    isIOS,
    isAndroid,
    isInAppBrowser,
    isIframe,
    install,
    deferredPrompt,
  };
}
