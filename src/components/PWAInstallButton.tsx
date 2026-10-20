import React, { useEffect, useState } from 'react';
import { Download, Check, Info } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-md">
        <Check className="w-3.5 h-3.5" />
        <span>PWA Active</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Ambient explanation for standard browsers
      alert('To install this app on your device, use your browser menu and select "Install app" or "Add to Home Screen".');
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
        title="Install Project Manager Autopilot as a native Progressive Web App on mobile or desktop"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>Install PWA</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-700 p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <Info className="w-5 h-5" />
              <h3 className="font-semibold text-white">Install on iOS Device</h3>
            </div>
            <p className="text-sm text-slate-300 space-y-2">
              1. Tap the <strong className="text-white">Share</strong> icon in the Safari navigation bar.<br />
              2. Scroll down and choose <strong className="text-white">Add to Home Screen</strong>.<br />
              3. Tap <strong className="text-white">Add</strong> in the top right.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
