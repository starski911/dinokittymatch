import { useEffect, useState } from 'react';

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

export function InstallBanner() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showIOS] = useState(() => !isStandalone() && isIOS());

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallPromptEvent); };
    const onInstalled = () => setPrompt(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (dismissed || (!prompt && !showIOS) || isStandalone()) return null;

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setDismissed(true);
    setPrompt(null);
  };

  return (
    <div className="cartoon-box-sm bg-indigo-900 text-white rounded-2xl p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">📲</span>
        <div className="text-xs leading-snug">
          <p className="font-black">Install on Home Screen</p>
          <p className="text-indigo-200 font-bold">
            {prompt ? 'Install as an app for full-screen offline play!' : 'Tap Share → "Add to Home Screen" for full-screen play!'}
          </p>
        </div>
      </div>
      {prompt && (
        <button type="button" onClick={install} className="cartoon-pill bg-amber-300 text-ink font-black text-xs px-3 py-2 rounded-xl shrink-0">
          Install
        </button>
      )}
    </div>
  );
}
