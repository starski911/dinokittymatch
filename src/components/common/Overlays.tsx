import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { attachConfettiCanvas } from '../../utils/confetti';

export function ConfettiCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => attachConfettiCanvas(ref.current), []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-50" aria-hidden="true" />;
}

export function ToastHost() {
  const { toasts } = useGame();
  return (
    <div role="status" aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 pointer-events-none w-[90%] max-w-sm">
      {toasts.map((t) => (
        <div key={t.id}
          className={`${t.className} toast-in text-white font-display font-bold text-xs sm:text-sm px-4 py-2 rounded-full border-3 border-ink shadow-[0_4px_0_#1e1b4b]`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

/** Comic-book starburst score popups, positioned over the card that triggered them. */
export function PopupHost() {
  const { popups } = useGame();
  return (
    <>
      {popups.map((p) => (
        <div key={p.id} style={{ left: p.x, top: p.y }}
          className={`floating-badge fixed px-3 py-1 rounded-full font-display font-bold text-xs sm:text-sm whitespace-nowrap ${p.className}`}>
          {p.text}
        </div>
      ))}
    </>
  );
}
