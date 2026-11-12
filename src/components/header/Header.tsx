import { useEffect, useRef, useState } from 'react';
import { formatTime, useGame } from '../../context/GameContext';

const HOLD_MS = 2200;

export function Header() {
  const { view, remaining, goHome, openMum } = useGame();
  const [holding, setHolding] = useState(false);
  const timer = useRef<number | null>(null);
  const held = useRef(false);

  const cancel = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };
  const start = () => {
    held.current = false;
    setHolding(true);
    timer.current = window.setTimeout(() => {
      held.current = true;
      setHolding(false);
      openMum('settings');
    }, HOLD_MS);
  };
  useEffect(() => cancel, []);

  const urgent = remaining > 0 && remaining <= 15;
  const warn = remaining > 0 && remaining <= 60;
  const badge = urgent ? 'bg-rose-500 animate-pulse' : warn ? 'bg-amber-300' : 'bg-white';
  const text = urgent ? 'text-white' : warn ? 'text-ink' : 'text-indigo-700';

  return (
    <header className="w-full max-w-2xl mx-auto px-3 pt-3 pb-1 flex items-center justify-between gap-2 z-20 relative">
      <button type="button" onClick={goHome}
        className={`btn-chunky bg-amber-300 hover:bg-amber-200 text-ink font-display font-bold px-3.5 py-2 rounded-2xl text-sm flex items-center gap-1.5 ${view === 'setup' || view === 'timesup' ? 'invisible' : ''}`}>
        <span className="text-lg">🏠</span>
        <span className="hidden sm:inline">Menu</span>
      </button>

      <div className={`cartoon-pill flex items-center gap-1.5 px-3.5 py-1 rounded-full transition-colors ${badge}`}>
        <span className={`text-xs font-black uppercase tracking-wider ${text}`}>⏱️ Time Left: {formatTime(remaining)}</span>
      </div>

      <button type="button" aria-label="Parent Controls"
        onMouseDown={start} onTouchStart={start} onMouseUp={cancel} onMouseLeave={cancel} onTouchEnd={cancel}
        onClick={() => { if (!held.current) openMum('settings'); held.current = false; }}
        className="cartoon-pill relative overflow-hidden bg-white hover:bg-amber-100 text-ink p-2.5 rounded-2xl transition active:translate-y-0.5 flex items-center gap-1">
        {holding && <div className="holding-bar absolute left-0 top-0 bottom-0 bg-indigo-200/70 pointer-events-none" style={{ animationDuration: `${HOLD_MS}ms` }} />}
        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-xs font-black relative z-10 hidden sm:inline">Mum</span>
      </button>
    </header>
  );
}
